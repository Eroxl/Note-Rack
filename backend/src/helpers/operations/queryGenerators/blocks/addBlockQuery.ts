interface addBlockQueryProps {
  'doc-ids': string[];
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
