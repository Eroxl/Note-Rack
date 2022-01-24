import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';

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
        reason: 'Insufficient parameters supplied to register an account!',
      });
    }

    res.jsonp({});
  },
);

export default router;
