import { Types } from 'mongoose';

interface addBlockQueryProps {
  'doc-ids': string[] | undefined;
  'new-block-type': string;
  'new-block-index': number,
  'new-block-properties': Record<string, unknown>,
  'new-block-id': string,
}

const addBlockQuery = async (props: unknown) => {
  const {
    'doc-ids': docIDs,
    'new-block-type': newBlockType,
    'new-block-index': newBlockIndex,
    'new-block-properties': newBlockProperties,
    'new-block-id': newBlockId,
  } = props as addBlockQueryProps;

  const arrayFilters: Record<string, unknown>[] = [];
  let queryString = 'data.';

  if (docIDs) {
    docIDs.forEach((element, docIDIndex) => {
      arrayFilters.push({
        [`a${docIDIndex}._id`]: new Types.ObjectId(element),
      });

      if (docIDIndex < (docIDs.length - 1)) {
        queryString += `$[a${docIDIndex}].children.`;
        return;
      }

      queryString += `$[a${docIDIndex}]`;
    });
  }

  return [
    {
      $push: {
        [queryString !== 'data.' ? queryString : 'data']: {
          $each: [{
            _id: newBlockId,
            blockType: newBlockType,
            properties: newBlockProperties,
          }],
          $position: newBlockIndex,
        },
      },
    },
    arrayFilters,
  ];
};

export default addBlockQuery;
