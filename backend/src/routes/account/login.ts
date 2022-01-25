import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

import redisClient from '../../databases/redis';
import UserModel from '../../models/userModel';

const router = express.Router();

router.post(
  '/login',
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // -=- Check that all parameters are supplied -=-
    if (!(password && email)) {
      res.status(400);
      res.jsonp({
        status: 'error',
        message: 'Insufficient parameters supplied to login!',
      });
      return;
    }

    // -=- Fetch user -=-
    const user = await UserModel.findOne({ email }).lean();

    // -=- Compare passwords -=-
    try {
      const isPasswordValid = await bcrypt.compare(password as string, user.password);

      if (isPasswordValid) {
        // -=- Setup session ID & refresh tokens -=-
        const sessionID = crypto.randomBytes(20).toString('hex');
        const refreshToken = crypto.randomBytes(20).toString('hex');

        // -=- Expire in 1 day -=-
        await redisClient.set(sessionID, email);
        await redisClient.expire(sessionID, 86400);
        res.setHeader('Set-Cookie', `ssn-cookie=${sessionID}; Max-Age=86400; Secure; HttpOnly`);

        // -=- Expire in 7 days -=-
        await redisClient.set(`rfrsh-${refreshToken}`, email);
        await redisClient.expire(`rfrsh-${refreshToken}`, 604800);
        res.setHeader('Set-Cookie', `rfrsh-cookie=${refreshToken}; Max-Age=604800; Secure; HttpOnly`);

        // -=- Return data -=-
        res.status(200);
        res.jsonp({
          status: 'success',
          message: 'Succesfully logged into account!',
        });
      } else {
        res.status(403);
        res.jsonp({
          status: 'error',
          message: 'Invalid email or password',
        });
      }
    } catch (error: any) {
      res.status(403);
      res.jsonp({
        status: 'error',
        message: 'Invalid email or password',
      });
    }
  },
);

export default router;
