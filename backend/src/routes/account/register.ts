import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import UserModel from '../../models/userModel';

const router = express.Router();

router.post(
  '/register',
  async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    // -=- Check that all parameters are supplied -=-
    if (!(password && username && email)) {
      res.status(400);
      res.jsonp({
        status: 'error',
        message: 'Insufficient parameters supplied to register an account!',
      });
    }

    // -=- Validate email -=-
    if (!(email as string).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
      res.status(400);
      res.jsonp({
        status: 'error',
        message: 'Invalid email supplied to register an account!',
      });
    }

    if (!(username as string).match(/^[a-zA-Z0-9_]*$/)) {
      res.status(400);
      res.jsonp({
        status: 'error',
        message: 'Invalid username supplied to register an account! Only alphanumeric characters allowed and underscores...',
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
