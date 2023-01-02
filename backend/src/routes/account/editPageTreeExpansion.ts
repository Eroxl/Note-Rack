import express from 'express';
import { SessionRequest } from 'supertokens-node/framework/express';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';

import PageMapModel from '../../models/pageMap';
import PageTreeModel from '../../models/pageTreeModel';

const router = express.Router();

router.patch(
  '/edit-page-tree/:page',
  verifySession(),
  async (req: SessionRequest, res) => {
    const username = req.session!.getUserId();
    const { page } = req.params;
    const { 'new-expansion-state': newExpansionState } = req.body;

    if (!username) {
      res.statusCode = 401;
      res.json({
        status: 'error',
        message: 'Please login to view your page tree!',
      });
      return;
    }

    const pageMap = await PageMapModel.findById(page).lean();

    const arrayFilters: Record<string, unknown>[] = [];
    let queryString = 'subPages';

    if (pageMap) {
      pageMap.pathToPage.push(page);

      pageMap.pathToPage.forEach((element: string, index: number) => {
        arrayFilters.push({
          [`a${index}._id`]: element,
        });

        if (index < (pageMap.pathToPage.length - 1)) {
          queryString += `.$[a${index}].subPages`;
        } else {
          queryString += `.$[a${index}]`;
        }
      });
    }

    await PageTreeModel.updateOne(
      {
        _id: username,
      },
      {
        $set: {
          [`${queryString}.expanded`]: newExpansionState,
        },
      },
      {
        arrayFilters,
      },
    );

    res.statusCode = 200;
    res.json({
      status: 'success',
      message: 'Succesfully changed page tree expansion state',
    });
  },
);

export default router;
