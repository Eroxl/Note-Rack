import PageMapModel from '../models/pageMap';
import PageTreeModel from '../models/pageTreeModel';
import PageModel from '../models/pageModel';

const addPage = async (
  page: string,
  username: string,
  newPageId?: string,
  newPageName?: string,
) => {
  const pageMap = await PageMapModel.findById(page).lean();

  const arrayFilters: Record<string, unknown>[] = [];
  let queryString = 'subPages';

  if (pageMap) {
    pageMap.pathToPage.push(page);
    pageMap.pathToPage.forEach((element: string, index: number) => {
      arrayFilters.push({
        [`a${index}._id`]: element,
      });

      queryString += `.$[a${index}].subPages`;
    });
  }

  await PageTreeModel.updateOne(
    {
      _id: username,
    },
    {
      $push: {
        [queryString]: {
          $each: [{
            _id: newPageId,
            expanded: false,
            style: {
              colour: {
                r: 147,
                g: 197,
                b: 253,
              },
              icon: '📝',
              name: newPageName || 'New Notebook',
            },
            subPages: [],
          }],
        },
      },
    },
    {
      arrayFilters,
    },
  );

  const newPageMap = pageMap !== null ? pageMap.pathToPage : [];

  await PageMapModel.create({
    _id: newPageId,
    pathToPage: newPageMap,
  });

  await PageModel.create({
    _id: newPageId,
    user: username,
    style: {
      colour: {
        r: 147,
        g: 197,
        b: 253,
      },
      icon: '📝',
      name: newPageName || 'New Notebook',
    },
    data: [],
  });
};

export default addPage;
