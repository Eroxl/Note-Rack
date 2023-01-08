import express from 'express';
import { SessionRequest } from 'supertokens-node/framework/express';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';

import deletePage from '../../../helpers/deletePage';

const router = express.Router();

router.delete(
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

    const { page } = req.params;

    try {
      await deletePage(
        page,
        username,
      );
    } catch (error) {
      res.statusCode = 500;
      res.json({
        status: 'error',
        message: `Something went wrong and the page could not be deleted, error: ${(error as Error).message}}`,
      });
      return;
    }

    res.statusCode = 200;
    res.json({
      status: 'success',
      message: {
        statusMessage: 'Succesfully deleted page!',
      },
    });
  },
);

export default router;
