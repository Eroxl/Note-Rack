import PageModel from '../../models/pageModel';

const queryAggregator = async (queries: Promise<Record<string, unknown>>[], page: string) => {
  Promise.all(queries).then((results) => {
    PageModel.bulkWrite(
      results.map((query) => ({
        updateOne: {
          filter: {
            _id: page,
          },
          update: query[0],
          arrayFilters: query[1],
          upsert: true,
        },
      })),
      {
        ordered: true,
      },
    );
  });
};

export default queryAggregator;
