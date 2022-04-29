import express, { Request, Response } from 'express';

import addBlock from '../../../helpers/blocks/addBlock';
import PageModel from '../../../models/pageModel';
import deleteBlock from '../../../helpers/blocks/deleteBlock';

const router = express.Router();

router.patch(
  '/:page/',
  async (req: Request, res: Response) => {
    const { username } = res.locals;
    const {
      'doc-ids': docIDs,
      'current-block-id': currentBlockID,
      'current-index': currentIndex,
      'new-index': newIndex,
      'current-block-type': blockType,
      'current-block-properties': properties,
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

    const pageData = await PageModel.findOne({ _id: page, user: username }).lean();

    if (!pageData) {
      res.statusCode = 404;
      res.json({
        status: 'error',
        message: 'You do not have access to this page or it does not exist...',
      });
      return;
    }

    const offset = currentIndex > newIndex ? 1 : 0;

    await deleteBlock(
      page,
      [...docIDs, currentBlockID],
    );

    await addBlock(
      page,
      docIDs,
      newIndex + offset,
      blockType,
      properties,
      currentBlockID,
    );

    res.statusCode = 200;
    res.json({
      status: 'success',
      message: 'Successfully moved block!',
    });
  },
);

export default router;
