import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

import UserModel from '../../models/userModel';

const redisClient = new Redis(+(process.env.REDIS_PORT || 6379), process.env.REDIS_IP, {
  enableOfflineQueue: false,
});

const router = express.Router();

const maxWrongAttemptsByIPperDay = 100;
const maxConsecutiveFailsByUsernameAndIP = 10;

const limiterSlowBruteByIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'login_fail_ip_per_day',
  points: maxWrongAttemptsByIPperDay,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 60 * 24,
});

const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'login_fail_consecutive_username_and_ip',
  points: maxConsecutiveFailsByUsernameAndIP,
  duration: 60 * 60 * 24 * 90,
  blockDuration: 60 * 60,
});

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

    const ipAddr = req.ip;
    const usernameIPkey = `${req.body.email}_${ipAddr}`;

    const [resUsernameAndIP, resSlowByIP] = await Promise.all([
      limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
      limiterSlowBruteByIP.get(ipAddr),
    ]);

    let retrySecs = 0;

    // Check if IP or Username + IP is already blocked
    if (resSlowByIP !== null && resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay) {
      retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
    } else if (
      resUsernameAndIP && resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP
    ) {
      retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
    }

    if (retrySecs > 0) {
      res.set('Retry-After', String(retrySecs));
      res.status(429);
      return;
    }

    // -=- Fetch user -=-
    const user = await UserModel.findOne({ email }).lean();

    // -=- Compare passwords -=-
    try {
      const isPasswordValid = await bcrypt.compare(password as string, user.password);

      if (isPasswordValid) {
        // -=- Setup session ID & refresh tokens -=-
        const jwtToken = jwt.sign({ user: user.username }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        const jwtRefreshToken = jwt.sign({ user: user.username }, process.env.JWT_SECRET as string, { expiresIn: '30d' });

        res.header('Set-Cookie', [`ssn-token=${jwtToken}; Path=/; Secure; HttpOnly`, `rfrsh-token=${jwtRefreshToken}; Path=/; Secure; HttpOnly`]);

        // -=- Return data -=-
        res.status(200);
        res.jsonp({
          status: 'success',
          message: 'Succesfully logged into account!',
        });
      } else {
        try {
          const promises = [limiterSlowBruteByIP.consume(ipAddr)];
          promises.push(limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey));

          res.status(403);
          res.jsonp({
            status: 'error',
            message: 'Invalid email or password',
          });
        } catch (error: any) {
          if (error instanceof Error) {
            throw error;
          } else {
            res.set('Retry-After', String(Math.round(error.msBeforeNext / 1000) || 1));
            res.status(429);
            res.jsonp({
              status: 'error',
              message: 'Too many failed requests',
            });
          }
        }
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
