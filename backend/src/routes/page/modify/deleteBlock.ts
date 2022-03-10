import mongoose from 'mongoose';
import express, { Request, Response } from 'express';

import PageModel from '../../../models/pageModel';

const router = express.Router();

router.delete(
  '/:page',
  async (req: Request, res: Response) => {
    const { username } = res.locals;
    const { docIDs } = req.body;
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

    const arrayFilters: Record<string, unknown>[] = [];
    let queryString = 'data.';

    (docIDs as string[]).forEach((element, index) => {
      arrayFilters.push({
        [`${index}._id`]: element,
      });

      if (index < (docIDs.length - 1)) {
        queryString += `$[${index}].children.`;
        return;
      }

      queryString += `$[${index}]`;
    });

    const newBlockId = new mongoose.Types.ObjectId();

    await PageModel.updateOne(
      {
        _id: page,
      },
      {
        $pull: {
          [queryString]: {},
        },
      },
      {
        arrayFilters,
      },
    );

    res.statusCode = 200;
    res.json({
      status: 'success',
      message: {
        statusMessage: 'Succesfully deleted block',
        blockID: newBlockId,
      },
    });
  },
);

export default router;
