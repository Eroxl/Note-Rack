import express from 'express';

import type { PageRequest } from '../../middleware/verifyPermissions';
import verifyPermissions from '../../middleware/verifyPermissions';
import queryAggregator from '../../helpers/operations/queryAggregator';
import queryGenerator from '../../helpers/operations/queryGenerators';
import ElasticSearchClient from '../../helpers/clients/ElasticSearchClient';
import RedisClient from '../../helpers/clients/RedisClient';
import refreshEmbeds from '../../helpers/refreshEmbeds';

const router = express.Router();

router.post(
  '/modify/:page',
  verifyPermissions(['write']),
  async (req: PageRequest, res) => {
    const { page } = req.params;
    const pageOwner = req.pageData!.user;

    // -=- If the user has permissions start updating the page -=-
    const { operations } = req.body;

    if (!operations) {
      res.statusCode = 400;
      res.json({
        status: 'error',
        message: 'No operations were provided...',
      });
      return;
    }

    res.statusCode = 200;
    res.json({
      status: 'success',
      message: 'Page updated successfully...',
    });

    // -=- Update the page -=-
    await queryAggregator(
      queryGenerator(operations),
      page,
    );

    const updateInfo = await RedisClient.get(`page:${page}`);

    const previousOperations = JSON.parse(updateInfo || '[]') as Record<string, unknown>[];

    const newOperations = [
      ...previousOperations,
      ...operations
        .map(
          (operation: any) => (
            operation.data['new-block-id']
            || operation.data['doc-ids'].pop()
          )
        )
        .filter((blockID: string | undefined) => blockID),
    ];

    await RedisClient.set(`page:${page}`, JSON.stringify(newOperations));

    if (newOperations.length > +(process.env.EMBED_REFRESH_THRESHOLD || 25)) {
      await refreshEmbeds(page, req.pageData!);
    }

    // -=- Update ElasticSearch -=-
    // NOTE:EROXL:(2022-03-29) - I swear I'll come back and refactor all of this later
    const elasticSearchOps = operations.flatMap((operation: Record<string, any>) => {
      if (operation.type === 'addBlock') {
        const { data } = operation as {
          data: {
            'new-block-id': string,
            'new-block-properties': {
              value: string,
            },
          },
        }

        const blockId = data['new-block-id'];

        return [
          {
            create: {
              _index: 'blocks',
              _id: `${page}.${blockId}`,
            }
          },
          {
            userID: pageOwner,
            blockId: blockId,
            pageId: page,
            content: data['new-block-properties']?.value || '',
          }
        ]
      } else if (operation.type === 'editBlock') {
        const { data } = operation as {
          data: {
            'doc-ids': string[],
            'block-properties': {
              value?: string,
            },
          },
        }

        const blockId = data['doc-ids'].pop();

        if (!data['block-properties']?.value) return [];

        return [
          {
            update: {
              _index: 'blocks',
              _id: `${page}.${blockId}`,
            }
          },
          {
            doc: {
              content: data['block-properties']?.value,
            }
          }
        ];
      } else if (operation.type === 'deleteBlock') {
        const { data } = operation as {
          data: {
            'doc-ids': string[],
          },
        }

        const blockId = data['doc-ids'].pop();
        
        return [
          {
            delete: {
              _index: 'blocks',
              _id: `${page}.${blockId}`,
            }
          }
        ];
      }
    });

    try {
      await ElasticSearchClient.bulk({
        operations: elasticSearchOps,
      });
    } catch (err) {
      console.error(err);
    }
  },
);

export default router;
