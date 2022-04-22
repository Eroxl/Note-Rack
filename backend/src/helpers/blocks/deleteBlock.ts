import PageModel from '../../models/pageModel';

const deleteBlock = async (page: string, docIDs: string[]) => {
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

  await PageModel.updateOne(
    {
      _id: page,
    },
    {
      $pull: {
        [queryString]: {
          _id: docIDs[docIDs.length - 1],
        },
      },
    },
    {
      arrayFilters,
    },
  );
};

export default deleteBlock;
