import express, { Request, Response } from 'express';

const router = express.Router();

router.post(
  '/',
  async (req: Request, res: Response) => {
    const { name } = req.query;

    res.jsonp({});
  },
);

export default router;
