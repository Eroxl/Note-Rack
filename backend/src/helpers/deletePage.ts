/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import PageModel from '../models/pageModel';
import PageMapModel from '../models/pageMap';
import PageTreeModel from '../models/pageTreeModel';

interface pageTreeType {
  _id: string,
  subPages: pageTreeType[],
}

const fullyRemovePage = async (
  pageID: string,
  pathToPage: string[],
  username: string,
) => {
  const arrayFilters: Record<string, unknown>[] = [];
  let queryString = '';

  pathToPage.forEach((element: string, index: number) => {
    arrayFilters.push({
      [`a${index}._id`]: element,
    });

    if (index < (pathToPage.length - 1)) {
      queryString += `$[a${index}].subPages.`;
    }
  });

  await PageTreeModel.updateOne(
    {
      user: username,
    },
    {
      $pull: {
        [queryString]: {
          _id: pageID,
        },
      },
    },
    {
      arrayFilters,
    },
  );

  await PageModel.findOneAndRemove({ _id: pageID, username });
};

const deletePage = async (
  page: string,
  username: string,
  pageTree?: pageTreeType,
  pageMap?: string[],
) => {
  if (!pageTree || !pageMap) {
    pageTree = await PageTreeModel.findOne({ user: username }).lean();
    pageMap = await PageMapModel.findById(page).lean();

    if (!pageMap || !pageTree) {
      throw new Error('User does not have a page tree or map.');
    }
  }

  fullyRemovePage(page, pageMap, username);

  if (pageTree.subPages.length > 0) {
    pageTree.subPages.forEach((subPage) => {
      deletePage(
        subPage._id,
        username,
        pageTree,
        pageMap?.concat([page]),
      );
    });
  }
};

export default deletePage;
