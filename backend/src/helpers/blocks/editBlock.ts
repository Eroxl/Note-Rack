import PageModel from '../../models/pageModel';

const editBlock = async (
  page: string,
  docIDs: string[],
  type: string,
  properties: Record<string, unknown>,
) => {
  const arrayFilters: Record<string, unknown>[] = [];
  let queryString = 'data.';

  docIDs.forEach((element, index) => {
    arrayFilters.push({
      [`a${index}._id`]: element,
    });

    if (index < (docIDs.length - 1)) {
      queryString += `$[a${index}].children.`;
      return;
    }

    queryString += `$[a${index}]`;
  });

  await PageModel.updateOne(
    {
      _id: page,
    },
    {
      $set: {
        ...(type !== undefined && { [`${queryString}.blockType`]: type }),
        ...(properties !== undefined && { [`${queryString}.properties`]: properties }),
      },
    },
    {
      arrayFilters,
    },
  );
};

export default editBlock;
