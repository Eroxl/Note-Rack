import express from 'express';
import { SessionRequest } from 'supertokens-node/framework/express';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';

import UserModel from '../../models/userModel';

const router = express.Router();

router.post(
  '/get-home-page',
  verifySession(),
  async (req: SessionRequest, res) => {
    const username = req.session?.getUserId();

    if (!username) {
      res.statusCode = 401;
      res.json({
        status: 'error',
        message: 'Please login to view your home page!',
      });
      return;
    }

    const user = await UserModel.findOne({ username }).lean();

    if (!user) {
      res.statusCode = 401;
      res.json({
        status: 'error',
        message: 'Your account does not exist! Please login with a different account...',
      });
      return;
    }

    if (!user.homePage) {
      res.statusCode = 401;
      res.json({
        status: 'error',
        message: 'Your account does not have a homepage! Please verify your account to gain one...',
      });
      return;
    }

    res.statusCode = 200;
    res.json({
      status: 'success',
      message: user.homePage,
    });
  },
);

export default router;
