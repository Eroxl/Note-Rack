// import PageModel from '../models/pageModel';
import PageMapModel from '../models/pageMap';
import PageModel from '../models/pageModel';
import PageTreeModel from '../models/pageTreeModel';

interface pageTreeType {
  _id: string,
  subPages: pageTreeType[],
}

const deletePage = async (
  pageID: string,
  username: string,
) => {
  // -=- Get Information -=-
  // ~ Get the page tree and map
  const pageTree = await PageTreeModel.findOne({ user: username }).lean();
  const pageMap = await PageMapModel.findById(pageID).lean() as { pathToPage: string[] } || undefined;

  // ~ Check if the user has a page tree and map
  if (!pageMap || !pageTree) {
    // NOTE:EROXL: Should never happen
    throw new Error('User does not have a page tree or map.');
  }

  // -=- Get Sub Pages -=-
  const getSubPages = (page: pageTreeType) => {
    return page.subPages.flatMap((subPage): string[] => ([
      subPage._id,
      ...getSubPages(subPage),
    ]));
  };

  const pagesToDelete = [pageID, ...getSubPages(pageTree)];

  // -=- Delete Sub Pages -=-
  // ~ Delete the top level page from the page tree
  const deletePageFromTree = (page: string, pathToPage: string[]) => {
    const arrayFilters: Record<string, unknown>[] = [];
    let queryString = 'subPages';

    // ~ Check if the top level page is the root page
    if (pathToPage.length === 0) throw new Error('Cannot delete the root page.');

    // ~ Get the path to the top level page
    pathToPage.forEach((element, index) => {
      if (index === pathToPage.length - 1) return;

      queryString += `.$[a${index}].subPages`;
      arrayFilters.push({
        [`a${index}._id`]: element,
      });
    });

    // ~ Delete the top level page
    PageTreeModel.updateOne(
      {
        user: username,
      },
      {
        $pull: {
          [queryString]: {
            _id: page,
          },
        },
      },
      {
        arrayFilters,
      },
    );
  };
  
  deletePageFromTree(pageID, pageMap.pathToPage);

  // ~ Delete the sub pages maps
  PageMapModel.deleteMany({
    _id: {
      $in: pagesToDelete,
    },
  });

  // ~ Delete the sub pages
  PageModel.deleteMany({
    _id: {
      $in: pagesToDelete,
    },
  });
};

export default deletePage;
