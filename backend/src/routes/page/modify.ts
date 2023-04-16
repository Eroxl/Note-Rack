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

          const index = data['new-block-index']

          return {
            type: 'update',
            id: `${page}-${data['new-block-properties']?.value as string}`,
            context: (req.pageData!.data as (IPage['data'][0] & { _id: string })[])
              .slice(Math.max(0, index - 5), Math.min(req.pageData!.data.length, index + 5))
              .map((block) => block._id as string),
            value: data['new-block-properties']?.value as string,
          }
        } else if (operation.type === 'editBlock') {
          const data = operation.data as editBlockQueryProps;

          if (!data['block-properties']?.value) return;
          
          const findBlock = (blockIDs: string[], blocks: (IPage['data'][0] & { _id: string })[]): [IPage['data'][0]  & { _id: string }, number] | undefined => {
            if (blockIDs.length === 1) {
              const index = blocks.findIndex((block) => block._id.toString() === blockIDs[0]);

              if (index === -1) return;

              return [blocks[index], index];
            }

            
            const block = blocks.find((block) => block._id.toString() === blockIDs[0]);

            if (!block) return;

            return findBlock(blockIDs.slice(1), block.children as unknown as (IPage['data'][0] & { _id: string })[]);
          };

          const [block, index] = findBlock(data['doc-ids'], req.pageData!.data as unknown as (IPage['data'][0] & { _id: string })[]) || [undefined, undefined]
          
          const oldText = block?.properties?.value as string;
          const newText = data['block-properties']?.value as string;

          if (index === undefined || !block) return;

          if (oldText === newText || newText === undefined || oldText === undefined) return;

          const updateDistance = distance(oldText, newText);

          if (updateDistance <= 0) return;

          return {
            type: 'update',
            id: `${page}-${data['doc-ids'][data['doc-ids'].length - 1]}`,
            context: (req.pageData!.data as (IPage['data'][0] & { _id: string })[])
              .slice(Math.max(0, index - 5), Math.min(req.pageData!.data.length, index + 5))
              .map((block) => block._id as string),
            value: newText,
          }
        } else {
          const data = operation.data as deleteBlockQueryProps;

          return {
            type: 'delete',
            id: `${page}-${data['doc-ids'][data['doc-ids'].length - 1]}`,
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
