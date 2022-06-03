interface deleteBlockQueryProps {
  'doc-ids': string[];
}

const addBlockQuery = async (props: unknown) => {
  const {
    'doc-ids': docIDs,
  } = props as deleteBlockQueryProps;

  const arrayFilters: Record<string, unknown>[] = [];
  let queryString = 'data';

  (docIDs as string[]).forEach((element, index) => {
    arrayFilters.push({
      [`a${index}._id`]: element,
    });

    if (index < (docIDs.length - 1)) {
      queryString += `.$[a${index}].children`;
    }
  });

  return [
    {
      $pull: {
        [queryString]: {
          _id: docIDs[docIDs.length - 1],
        },
      },
    },
    arrayFilters,
  ];
};

export default addBlockQuery;
