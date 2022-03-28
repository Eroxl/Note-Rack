/* eslint-disable no-underscore-dangle */
import express, { Request, Response } from 'express';

import deletePage from '../../../helpers/deletePage';

const router = express.Router();

router.delete(
  '/:page/',
  async (req: Request, res: Response) => {
    const { username } = res.locals;

    if (!username) {
      res.statusCode = 401;
      res.json({
        status: 'error',
        message: 'Please login to view this page!',
      });
      return;
    }

    const { page } = req.params;

    try {
      deletePage(
        page,
        username,
      );
    } catch (error) {
      res.statusCode = 500;
      res.json({
        status: 'error',
        message: 'Something went wrong and the page could not be deleted',
      });
    }

    res.statusCode = 200;
    res.json({
      status: 'success',
      message: {
        statusMessage: 'Succesfully deleted page!',
      },
    });
  },
);

export default router;
