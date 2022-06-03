import PageModel from '../../models/pageModel';

const queryAggregator = async (queries: Promise<Record<string, unknown>[]>, page: string) => {
  PageModel.bulkWrite(
    (await queries).map((query) => ({
      updateOne: {
        filter: {
          _id: page,
        },
        update: query[0],
        arrayFilters: query[0],
      },
    })),
    {
      ordered: true,
    },
  );
};

export default queryAggregator;
