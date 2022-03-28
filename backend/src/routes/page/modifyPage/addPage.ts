import express, { Request, Response } from 'express';

import addPage from '../../../helpers/addPage';
import PageTreeModel from '../../../models/pageTreeModel';

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
      'new-page-name': newPageName,
    } = req.body;

    await addPage(
      page,
      username,
      newPageId,
      newPageName,
    );

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
