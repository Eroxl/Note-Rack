import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import UserModel from '../../models/userModel';

const router = express.Router();

router.post(
  '/register',
  async (req: Request, res: Response) => {
    const { username, email, password } = req.query;

    // -=- Check that all parameters are supplied -=-
    if (!(password && username && email)) {
      res.status(400);
      res.jsonp({
        status: 'error',
        message: 'Insufficient parameters supplied to register an account!',
      });
    }

    // -=- Hash and salt password -=-
    const passwordHash = await bcrypt.hash(
      password as string,
      10,
    );

    try {
      await UserModel.create({
        username,
        email,
        password: passwordHash,
        verified: false,
      });

      // -=- Succesfuly created account -=-
      res.status(200);
      res.jsonp({
        status: 'success',
        message: 'Succesfully created user account!',
      });
    } catch (error: any) {
      if (error.code === 11000) {
        // -=- Duplicated email or username -=-
        res.status(409);
        res.jsonp({
          status: 'error',
          message: 'Account already registered please login.',
        });
      } else {
        // -=- Unknown Error -=-
        res.status(500);
        res.jsonp({
          status: 'error',
          message: 'Internal server error please try again later.',
        });
      }
    }
  },
);

export default router;
