import express, { Request, Response } from 'express';
import crypto from 'crypto';

import redisClient from '../../databases/redis';

const router = express.Router();

router.post(
  '/refresh-token',
  async (req: Request, res: Response) => {
    const { 'rfrsh-cookie': refreshCookie } = req.cookies;

    const refreshEmail = redisClient.get(refreshCookie);

    if (refreshEmail !== null && (refreshCookie as string).startsWith('rfrsh-')) {
      // -=- Revoke old refresh token -=-
      await redisClient.del(refreshCookie);

      // -=- Setup session ID & refresh tokens -=-
      const sessionID = crypto.randomBytes(20).toString('hex');
      const refreshToken = crypto.randomBytes(20).toString('hex');

      // -=- Expire in 1 day -=-
      await redisClient.set(sessionID, refreshEmail as unknown as string);
      await redisClient.expire(sessionID, 86400);
      res.setHeader('Set-Cookie', `ssn-cookie=${sessionID}; Max-Age=86400; Secure; HttpOnly`);

      // -=- Expire in 7 days -=-
      await redisClient.set(`rfrsh-${refreshToken}`, refreshEmail as unknown as string);
      await redisClient.expire(`rfrsh-${refreshToken}`, 604800);
      res.setHeader('Set-Cookie', `rfrsh-cookie=${refreshToken}; Max-Age=604800; Secure; HttpOnly`);

      // -=- Return data -=-
      res.status(200);
      res.jsonp({
        status: 'success',
        message: 'Succesfully generated refresh token!',
      });
    } else {
      res.status(401);
      res.jsonp({
        status: 'error',
        message: 'Invalid refresh token.',
      });
    }
  },
);

export default router;
