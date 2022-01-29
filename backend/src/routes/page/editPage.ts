import express, { Request, Response } from 'express';
import crypto from 'crypto';

import PageModel from '../../models/pageModel';

const router = express.Router();

interface deleteActionData {
  blockID: string,
}

interface addActionData {
  blockType: string,
  index: number,
}

interface editActionData {
  blockID: string,
  data: {
    blockType: String | undefined,
    properties: any | undefined,
    style: any | undefined,
  }
}

router.patch(
  '/update-page/:page',
  async (req: Request, res: Response) => {
    const { page } = req.params;
    const { username } = res.locals;
    const { action, actionData } = req.body as { action: 'delete' | 'add' | 'edit', actionData: deleteActionData | addActionData | editActionData };

    if (!(action && actionData)) {
      res.statusCode = 400;
      res.json({
        status: 'error',
        message: 'Insufficient parameters supplied to edit a page!',
      });
      return;
    }

    if (!username) {
      res.statusCode = 401;
      res.json({
        status: 'error',
        message: 'Please login to view this page!',
      });
      return;
    }

    const pageData = await PageModel.findById(page, 'user').lean();

    if (!pageData) {
      res.statusCode = 404;
      res.json({
        status: 'error',
        message: 'Page not found please try another page...',
      });
      return;
    }

    if (pageData.user !== username) {
      res.statusCode = 403;
      res.json({
        status: 'error',
        message: 'You do not have access to this file please login with a different account to view it...',
      });
      return;
    }

    switch (action) {
      case 'delete': {
        const typedActionData = actionData as deleteActionData;

        PageModel.findOneAndUpdate(
          {
            _id: page,
          },
          {
            $pull: {
              'data.$.blockID': typedActionData.blockID,
            },
          },
        );
        break;
      }

      case 'add': {
        const typedActionData = actionData as addActionData;
        PageModel.findOneAndUpdate(
          {
            _id: page,
          },
          {
            $push: {
              data: {
                $each: [{
                  blockType: typedActionData.blockType,
                  blockID: crypto.randomBytes(20).toString('hex'),
                  properties: {},
                  style: {},
                }],
                $position: typedActionData.index,
              },
            },
          },
        );
        break;
      }

      case 'edit': {
        const typedActionData = actionData as editActionData;
        PageModel.findOneAndUpdate(
          {
            _id: page,
          },
          {
            $set: {
              ...(typedActionData.data.blockType && { 'data.$.style': typedActionData.data.blockType }),
              ...(typedActionData.data.properties && { 'data.$.style': typedActionData.data.properties }),
              ...(typedActionData.data.style && { 'data.$.style': typedActionData.data.style }),
            },
          },
        );
        break;
      }

      default:
        res.statusCode = 400;
        res.json({
          status: 'error',
          message: 'Invalid operation',
        });
        break;
    }
  },
);

export default router;
