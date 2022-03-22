import express, { Request, Response } from 'express';

import PageMapModel from '../../../models/pageMap';
import PageTreeModel from '../../../models/pageTreeModel';
import PageModel from '../../../models/pageModel';

const router = express.Router();

router.post(
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
        message: 'You do not have any pages to add to!',
      });
    }

    const { page } = req.params;
    const {
      'new-page-id': newPageId,
    } = req.body;

    const pageMap = await PageMapModel.findById(page).lean();

    const arrayFilters: Record<string, unknown>[] = [];
    let queryString = 'subPages';

    if (pageMap) {
      pageMap.pathToPage.push(page);
      pageMap.pathToPage.forEach((element: string, index: number) => {
        arrayFilters.push({
          [`a${index}._id`]: element,
        });

        queryString += `.$[a${index}].subPages`;
      });
    }

    await PageTreeModel.updateOne(
      {
        _id: username,
      },
      {
        $push: {
          [queryString]: {
            $each: [{
              _id: newPageId,
              expanded: false,
              style: {},
              subPages: [],
            }],
          },
        },
      },
      {
        arrayFilters,
      },
    );

    const newPageMap = pageMap !== null ? pageMap.pathToPage : [];

    await PageMapModel.create({
      _id: newPageId,
      pathToPage: newPageMap,
    });

    await PageModel.create({
      _id: newPageId,
      user: username,
      style: {
        colour: {
          r: 147,
          g: 197,
          b: 253,
        },
        icon: '📝',
        name: 'New Notebook',
      },
      data: [],
    });

    res.statusCode = 200;
    res.json({
      status: 'success',
      message: {
        statusMessage: 'Succesfully created page!',
      },
    });
  },
);

export default router;
