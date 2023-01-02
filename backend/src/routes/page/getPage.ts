import express from 'express';
import { SessionRequest } from 'supertokens-node/framework/express';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';

import PageModel from '../../models/pageModel';

const router = express.Router();

router.get(
  '/get-page/:page',
  verifySession(),
  async (req: SessionRequest, res) => {
    const { page } = req.params;
    const username = req.session!.getUserId();

    if (!username) {
      res.statusCode = 401;
      res.json({
        status: 'error',
        message: 'Please login to view this page!',
      });
      return;
    }

    const pageData = await PageModel.findById(page).lean();

    if (!pageData) {
      res.statusCode = 404;
      res.json({
        status: 'error',
        message: 'Page not found please try another page...',
      });
      return;
    }

    if (pageData.user !== username) {
      res.statusCode = 403;
      res.json({
        status: 'error',
        message: 'You do not have access to this file please login with a different account to view it...',
      });
      return;
    }

    res.statusCode = 200;
    res.json({
      status: 'success',
      message: {
        style: pageData.style,
        data: pageData.data,
      },
    });
  },
);

export default router;
