import express, { Request, Response } from 'express';

import addBlock from '../../../helpers/blocks/addBlock';
import PageModel from '../../../models/pageModel';

const router = express.Router();

router.post(
  '/:page',
  async (req: Request, res: Response) => {
    const { username } = res.locals;
    const {
      'doc-ids': docIDs,
      'new-block-type': newBlockType,
      'new-block-index': newBlockIndex,
      'new-block-properties': newBlockProperties,
    } = req.body;
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

    const newBlockID = await addBlock(
      page,
      docIDs,
      newBlockIndex,
      newBlockType,
      newBlockProperties || {},
    );

    res.statusCode = 200;
    res.json({
      status: 'success',
      message: {
        statusMessage: 'Succesfully added block',
        blockID: newBlockID,
      },
    });
  },
);

export default router;
