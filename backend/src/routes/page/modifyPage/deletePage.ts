import express from 'express';

import deletePage from '../../../helpers/deletePage';
import verifyPermissions from '../../../middleware/verifyPermissions';
import type { PageRequest } from '../../../middleware/verifyPermissions';

const router = express.Router();

router.delete(
  '/:page/',
  verifyPermissions(['admin']),
  async (req: PageRequest, res) => {
    const { page } = req.params;
    const pageOwner = req.pageData!.user;

    await deletePage(
      page,
      pageOwner,
    );

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
