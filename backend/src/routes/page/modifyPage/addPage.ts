import express from 'express';
import { SessionRequest } from 'supertokens-node/framework/express';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';

import addPage from '../../../helpers/addPage';
import PageTreeModel from '../../../models/pageTreeModel';

const router = express.Router();

router.post(
  '/:page/',
  verifySession(),
  async (req: SessionRequest, res) => {
    const username = req.session!.getUserId();

    if (!username) {
      res.statusCode = 401;
      res.json({
        status: 'error',
        message: 'Please login to view this page!',
      });
      return;
    }

    const pageTree = await PageTreeModel.findOne({ user: username }, 'user').lean();

    if (!pageTree) {
      res.statusCode = 500;
      res.json({
        status: 'error',
        message: 'You do not have any pages to add to!',
      });
    }

    const { page } = req.params;
    const {
      'new-page-id': newPageId,
      'new-page-name': newPageName,
    } = req.body;

    await addPage(
      page,
      username,
      newPageId,
      newPageName,
    );

    res.statusCode = 200;
    res.json({
      status: 'success',
      message: {
        statusMessage: 'Succesfully created page!',
      },
    });
  },
);

export default router;
