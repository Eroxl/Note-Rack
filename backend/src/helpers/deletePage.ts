// import PageModel from '../models/pageModel';
import PageMapModel from '../models/pageMap';
import PageModel from '../models/pageModel';
import PageTreeModel from '../models/pageTreeModel';
import mongoose from 'mongoose';
import ElasticSearchClient from './search/ElasticSearchClient';

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
  const pageTree = await PageTreeModel.findOne({ _id: username }).lean();
  const pageMap = await PageMapModel.findById(pageID).lean() as { pathToPage: string[] } || undefined;

  // ~ Check if the user has a page tree and map
  if (!pageMap || !pageTree) {
    // NOTE:EROXL: Should never happen
    throw new Error('User does not have a page tree or map.');
  }

  // -=- Get Sub Pages -=-
  const getSubPages = (page: pageTreeType, pathToPage: string[], pageID: string) => {
    // ~ Traverse pageTree using pageMap.pathToPage
    let subPage = page;
    [...pathToPage, pageID].forEach((element) => {
      subPage = subPage.subPages.find((page) => page._id === element) as pageTreeType;
    });

    // ~ Get all sub pages
    const subPages: string[] = [];
    const traverse = (page: pageTreeType) => {
      subPages.push(page._id);
      page.subPages.forEach((page) => traverse(page));
    }
    traverse(subPage);

    return subPages;
  };

  const pagesToDelete = getSubPages(pageTree, pageMap.pathToPage, pageID);
  const objectIDsToDelete = pagesToDelete.map((id) => new mongoose.Types.ObjectId(id));

  // -=- Delete Sub Pages -=-
  // ~ Delete the top level page from the page tree
  const deletePageFromTree = async (page: string, pathToPage: string[], username: string) => {
    const arrayFilters: Record<string, unknown>[] = [];
    let queryString = 'subPages';

    // ~ Check if the top level page is the root page
    if (pathToPage.length === 0) throw new Error('Cannot delete the root page.');

    // ~ Get the path to the top level page
    pathToPage.forEach((element, index) => {
      // NOTE:EROXL: This is because the root of the page tree is 
      //             technically a sub page so we don't need to -1 the index
      if (index === pathToPage.length) return;

      queryString += `.$[a${index}].subPages`;
      arrayFilters.push({
        [`a${index}._id`]: element,
      });
    });

    // ~ Delete the top level page
    await PageTreeModel.updateOne(
      {
        _id: username,
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
  
  await deletePageFromTree(pageID, pageMap.pathToPage, username);
  
  // ~ Delete the sub pages maps
  await PageMapModel.deleteMany({
    _id: {
      $in: objectIDsToDelete,
    },
  });

  // ~ Delete the sub pages
  await PageModel.deleteMany({
    _id: {
      $in: objectIDsToDelete,
    },
  });

  await ElasticSearchClient.bulk({
    operations: pagesToDelete.map((pageID) => ({
      delete: {
        _index: 'blocks',
        _id: `${pageID}.*`,
      }
    }))
  })
};

export default deletePage;
