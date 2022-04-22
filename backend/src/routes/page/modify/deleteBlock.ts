import express, { Request, Response } from 'express';

import PageModel from '../../../models/pageModel';
import deleteBlock from '../../../helpers/blocks/deleteBlock';

const router = express.Router();

router.delete(
  '/:page',
  async (req: Request, res: Response) => {
    const { username } = res.locals;
    const { 'doc-ids': docIDs } = req.body;
    const { page } = req.params;

    if (!username) {
      res.statusCode = 401;
      res.json({
        status: 'error',
        message: 'Please login to view this page!',
      });
      return;
    }

    const pageData = await PageModel.findOne({ _id: page, user: username }, 'user').lean();

    if (!pageData) {
      res.statusCode = 404;
      res.json({
        status: 'error',
        message: 'You do not have access to this page or it does not exist...',
      });
      return;
    }

    if (!docIDs) {
      res.statusCode = 400;
      res.json({
        status: 'error',
        message: {
          statusMessage: 'Please provide a list of docIDs in the body to delete an element...',
        },
      });
      return;
    }

    await deleteBlock(page, docIDs);

    res.statusCode = 200;
    res.json({
      status: 'success',
      message: {
        statusMessage: 'Succesfully deleted block',
      },
    });
  },
);

export default router;
