import express from 'express';
import { SessionRequest } from 'supertokens-node/framework/express';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';

import queryAggregator from '../../helpers/operations/queryAggregator';
import queryGenerator from '../../helpers/operations/queryGenerators';
import PageModel from '../../models/pageModel';

const router = express.Router();

router.post(
  '/modify/:page',
  verifySession(),
  async (req: SessionRequest, res) => {
    const { page } = req.params;
    const username = req.session!.getUserId();

    // -=- Check if user is logged in -=-
    if (!username) {
      res.statusCode = 401;
      res.json({
        status: 'error',
        message: 'Please login to modify this page!',
      });
      return;
    }

    // -=- Check if user has permissions to access this page -=-
    const pageData = await PageModel.findOne({ _id: page, user: username }, 'user').lean();

    if (!pageData) {
      res.statusCode = 404;
      res.json({
        status: 'error',
        message: 'You do not have access to this page or it does not exist...',
      });
    }

    // -=- If the user has permissions start updating the page -=-
    const { operations } = req.body;

    if (!operations) {
      res.statusCode = 400;
      res.json({
        status: 'error',
        message: 'No operations were provided...',
      });
      return;
    }

    res.statusCode = 200;
    res.json({
      status: 'success',
      message: 'Page updated successfully...',
    });

    // -=- Update the page -=-
    queryAggregator(
      queryGenerator(operations),
      page,
    );
  },
);

export default router;
