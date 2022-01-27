import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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
