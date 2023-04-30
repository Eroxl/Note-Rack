import { Types } from 'mongoose';

export interface deleteBlockQueryProps {
  'doc-ids': string[];
}

const deleteBlockQuery = async (props: unknown) => {
  const {
    'doc-ids': docIDs,
  } = props as deleteBlockQueryProps;

  const arrayFilters: Record<string, unknown>[] = [];
  let queryString = 'data';

  (docIDs as string[]).forEach((element, index) => {
    if (index === docIDs.length - 1) return;

    queryString += `.$[a${index}].children`;
    arrayFilters.push({
      [`a${index}._id`]: new Types.ObjectId(element),
    });
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

export default deleteBlockQuery;
