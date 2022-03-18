/* eslint-disable no-underscore-dangle */
import express, { Request, Response } from 'express';

import PageModel from '../../../models/pageModel';
import PageMapModel from '../../../models/pageMap';
import PageTreeModel from '../../../models/pageTreeModel';

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

    const pageTree = await PageTreeModel.findOne({ user: username }, 'user').lean();

    if (!pageTree) {
      res.statusCode = 500;
      res.json({
        status: 'error',
        message: 'You do not have any pages to delete!',
      });
    }

    const { page } = req.params;

    const pageMap = await PageMapModel.findById(page).lean();

    const arrayFilters: Record<string, unknown>[] = [];
    let queryString = '';

    pageMap.pathToPage.forEach((element: string, index: number) => {
      arrayFilters.push({
        [`a${index}._id`]: element,
      });

      if (index < (pageMap.pathToPage.length - 1)) {
        queryString += `$[a${index}].subPages.`;
      }
    });

    PageTreeModel.updateOne(
      {
        user: username,
      },
      {
        $pull: {
          [queryString]: {
            _id: pageMap._id,
          },
        },
      },
      {
        arrayFilters,
      },
    );

    PageModel.findOneAndRemove({ _id: page, username });

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
