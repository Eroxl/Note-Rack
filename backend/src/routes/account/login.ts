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
    // try {
    const isPasswordValid = await bcrypt.compare(password as string, user.password);

    if (isPasswordValid) {
      // -=- Setup session ID -=-
      const sessionID = crypto.randomBytes(20).toString('hex');
      const refreshToken = crypto.randomBytes(20).toString('hex');
      await redisClient.set(sessionID, email);
      await redisClient.set(refreshToken, email);

      // -=- Setup session timeout time -=-
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 3);

      await redisClient.expireAt(sessionID, Math.round(+expirationDate / 1000));

      // -=- Return data -=-
      res.setHeader('Set-Cookie', `ssn-cookie=${sessionID}; Expires=${expirationDate.toUTCString()}; Secure; HttpOnly`);
      res.setHeader('Set-Cookie', `rfrsh-cookie=${sessionID}; Expires=${expirationDate.toUTCString()}; Secure; HttpOnly`);
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
    // } catch (error: any) {
    //   res.status(403);
    //   res.jsonp({
    //     status: 'error',
    //     message: 'Invalid email or password',
    //   });
    // }
  },
);

export default router;
