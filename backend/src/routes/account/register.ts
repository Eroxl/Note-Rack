import express, { Request, Response } from 'express';

const router = express.Router();

router.post(
  '/register',
  async (req: Request, res: Response) => {
    const { username, email, password } = req.query;

    res.jsonp({});
  },
);

export default router;
