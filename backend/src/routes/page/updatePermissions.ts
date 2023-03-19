import express from 'express';
import ThirdParty from 'supertokens-node/recipe/thirdparty';

import PageModel from '../../models/pageModel';
import verifyPermissions, { PageRequest } from '../../middleware/verifyPermissions';
import PageTreeModel from '../../models/pageTreeModel';
import PageMapModel from '../../models/pageMap';

const router = express.Router();

router.post(
  '/update-permissions/:page/',
  verifyPermissions(['admin']),
  async (req: PageRequest, res) => {
    const username = req.pageData!.user;
    const { page } = req.params;
    const { email, permissions } = req.body;

    // -=- If the user has permissions start updating the page -=-
    if (!email || !permissions) {
      res.statusCode = 400;
      res.json({
        status: 'error',
        message: 'No email or permissions were provided...',
      });
      return;
    }

    if (permissions.admin && username !== req.session!.getUserId()) {
      res.statusCode = 400;
      res.json({
        status: 'error',
        message: 'You cannot edit admin permissions...',
      });
      return;
    }

    const updaterEmail = (await ThirdParty.getUserById(req.session!.getUserId()))?.email;

    if (updaterEmail === email) {
      res.statusCode = 400;
      res.json({
        status: 'error',
        message: 'You cannot update your own permissions...',
      });
      return;
    }

    // ~ Get the user ID from the email (or * if it's a wildcard)
    const userId = email === '*'
      ? ['*']
      : (await ThirdParty.getUsersByEmail(email)).map((user) => user.id)

    if (!userId || userId.length === 0) {
      res.statusCode = 404;
      res.json({
        status: 'error',
        message: 'This user does not exist...',
      });
      return;
    }

    // ~ Get all sub pages and update their permissions
    const pageMap = await PageMapModel.findById(page).lean();
    const pageTree = await PageTreeModel.findById(username).lean();

    if (!pageMap || !pageTree) {
      res.statusCode = 404;
      res.json({
        status: 'error',
        message: 'This page does not exist...',
      });
      return;
    }
    
    pageMap.pathToPage.push(page);

    // Traverse the page tree to get all sub pages
    const startingPageTree = (() => {
      let subPageTree = pageTree;
      let subPageMap = pageMap;
      while (subPageMap.pathToPage.length > 0) {
        const pageID = subPageMap.pathToPage.shift()!;
        subPageTree = subPageTree.subPages.find((subPage) => subPage._id === pageID)!;
      }

      return subPageTree;
    })();

    let subPages: string[] = (() => {
      const subPages: string[] = [];
      const traverse = (pageTree: any) => {
        subPages.push(pageTree._id);
        pageTree.subPages.forEach((subPage: any) => traverse(subPage));
      };

      traverse(startingPageTree);
      return subPages;
    })();

    await PageModel.updateMany(
      {
        _id: {
          $in: subPages,
        } 
      },
      {
        $set: {
          [`permissions.${userId[0]}`]: {
            ...permissions,
            email,
          },
        }
      },
    );

    res.statusCode = 200;
    res.json({
      status: 'success',
      message: 'Page updated successfully...',
    });
  },
);

export default router;
