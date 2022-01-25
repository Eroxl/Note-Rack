import express, { Request, Response } from 'express';

import redisClient from '../../databases/redis';

const router = express.Router();

router.post(
  '/logout',
  async (req: Request, res: Response) => {
    const { 'rfrsh-cookie': refreshCookie, 'ssn-cookie': sessionCookie } = req.cookies;

    await redisClient.del(`rfrsh-${refreshCookie}`);
    await redisClient.del(sessionCookie);

    // -=- Return data -=-
    res.status(200);
    res.jsonp({
      status: 'success',
      message: 'Succesfully logged out!',
    });
  },
);

export default router;
