import express from 'express';
import { distance } from 'fastest-levenshtein';

import type { IPage } from '../../models/pageModel';
import type { PageRequest } from '../../middleware/verifyPermissions';
import type { addBlockQueryProps } from '../../helpers/operations/queryGenerators/blocks/addBlockQuery';
import type { editBlockQueryProps } from '../../helpers/operations/queryGenerators/blocks/editBlockQuery';
import type { deleteBlockQueryProps } from '../../helpers/operations/queryGenerators/blocks/deleteBlockQuery';
import type { EmbedOperation } from '../../helpers/refreshEmbeds';

import verifyPermissions from '../../middleware/verifyPermissions';
import queryAggregator from '../../helpers/operations/queryAggregator';
import queryGenerator from '../../helpers/operations/queryGenerators';
import updateElasticsearchIndexes from '../../helpers/updateElasticsearchIndexes';
import refreshEmbeds from '../../helpers/refreshEmbeds';

const router = express.Router();

interface IOperation {
  type: 'addBlock' | 'editBlock' | 'deleteBlock';
  data: addBlockQueryProps | editBlockQueryProps | deleteBlockQueryProps;
}

router.post(
  '/modify/:page',
  verifyPermissions(['write']),
  async (req: PageRequest, res) => {
    const { page } = req.params;
    const pageOwner = req.pageData!.user;

    // -=- If the user has permissions start updating the page -=-
    const { operations } = req.body as { operations: IOperation[] };

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
      queryGenerator(operations as any),
      page,
    );
    
    // -=- Update ElasticSearch -=-
    await updateElasticsearchIndexes(operations, page, pageOwner);

    // -=- Refresh Embeds -=-
    const embedChanges = operations
      .map((operation) => {
        if (operation.type == 'addBlock') {
          const data = operation.data as addBlockQueryProps;
          
          if (!data['new-block-properties']?.value) return;

          return {
            type: 'update',
            id: data['new-block-properties']?.value as string,
            value: data['new-block-properties']?.value as string,
          }
        } else if (operation.type === 'editBlock') {
          const data = operation.data as editBlockQueryProps;

          if (!data['block-properties']?.value) return;
          
          const findBlock = (blockIDs: string[], blocks: (IPage['data'][0] & { _id: string })[]): IPage['data'][0] | undefined => {
            if (blockIDs.length === 1) return blocks.find((block) => block._id === blockIDs[0]);

            const block = blocks.find((block) => block._id === blockIDs[0]);

            if (!block) return;

            return findBlock(blockIDs.slice(1), block.children as unknown as (IPage['data'][0] & { _id: string })[]);
          };

          const block = findBlock(data['doc-ids'], req.pageData!.data as unknown as (IPage['data'][0] & { _id: string })[]);

          const oldText = block?.properties?.value as string || ''
          const newText = data['block-properties']?.value as string;

          if (oldText === newText || !newText || !oldText) return;

          const updateDistance = distance(oldText, newText);

          if (updateDistance <= 10) return;

          return {
            type: 'update',
            id: data['doc-ids'].pop() as string,
            value: newText,
          }
        } else {
          const data = operation.data as deleteBlockQueryProps;

          return {
            type: 'delete',
            id: data['doc-ids'].pop() as string,
          }
        }
      })
      .filter((operation) => operation) as EmbedOperation[];

    if (embedChanges.length > 0) {
      await refreshEmbeds(embedChanges, page, pageOwner);
    }
  }
);

export default router;
