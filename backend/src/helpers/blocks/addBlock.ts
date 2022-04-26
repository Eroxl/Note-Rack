import mongoose from 'mongoose';

import PageModel from '../../models/pageModel';

const addBlock = async (
  page: string,
  docIDs: string[],
  index: number,
  type: string,
  properties: Record<string, unknown>,
  blockID?: string,
): Promise<string> => {
  const arrayFilters: Record<string, unknown>[] = [];
  let queryString = 'data.';

  if (docIDs) {
    (docIDs as string[]).forEach((element, docIDIndex) => {
      arrayFilters.push({
        [`${docIDIndex}._id`]: element,
      });

      if (docIDIndex < (docIDs.length - 1)) {
        queryString += `$[${docIDIndex}].children.`;
        return;
      }

      queryString += `$[${docIDIndex}]`;
    });
  }

  const newBlockId = blockID || new mongoose.Types.ObjectId();

  await PageModel.updateOne(
    {
      _id: page,
    },
    {
      $push: {
        [queryString !== 'data.' ? queryString : 'data']: {
          $each: [{
            _id: newBlockId,
            blockType: type,
            properties,
          }],
          $position: index,
        },
      },
    },
    {
      arrayFilters,
    },
  );

  return newBlockId.toString();
};

export default addBlock;
