import express from 'express';

import addPage from '../../../helpers/addPage';
import verifyPermissions from '../../../middleware/verifyPermissions';
import type { PageRequest } from '../../../middleware/verifyPermissions';

const router = express.Router();

router.post(
  '/:page/',
  verifyPermissions(['write']),
  async (req: PageRequest, res) => {
    const pageOwner = req.pageData.user;

    const { page } = req.params;
    const {
      'new-page-id': newPageId,
      'new-page-name': newPageName,
    } = req.body;

    await addPage(
      page,
      pageOwner,
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
