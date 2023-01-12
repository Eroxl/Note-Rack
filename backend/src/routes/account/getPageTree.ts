import express from 'express';
import { SessionRequest } from 'supertokens-node/framework/express';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';

import PageTreeModel from '../../models/pageTreeModel';

const router = express.Router();

router.get(
  '/get-page-tree',
  verifySession(),
  async (req: SessionRequest, res) => {
    const username = req.session!.getUserId();

    if (!username) {
      res.statusCode = 401;
      res.json({
        status: 'error',
        message: 'Please login to view your page tree!',
      });
      return;
    }

    const userTree = await PageTreeModel.findById(username).lean();

    if (!userTree) {
      res.statusCode = 401;
      res.json({
        status: 'error',
        message: 'Your account does not have a tree! Please login with a different account...',
      });
      return;
    }

    res.statusCode = 200;
    res.json({
      status: 'success',
      message: userTree,
    });
  },
);

export default router;
