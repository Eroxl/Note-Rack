import express, { Request, Response } from 'express';

import PageModel from '../../../models/pageModel';

const router = express.Router();

router.patch(
  '/edit-block',
  async (req: Request, res: Response) => {
    const { username } = res.locals;
    const {
      page,
      docIDs,
      properties,
      blockType,
    } = req.body;

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

    await PageModel.updateOne(
      {
        _id: page,
      },
      {
        $set: {
          ...(blockType !== undefined && { [`${queryString}.blockType`]: blockType }),
          ...(properties !== undefined && { [`${queryString}.properties`]: properties }),
        },
      },
      {
        arrayFilters,
      },
    );
  },
);

export default router;