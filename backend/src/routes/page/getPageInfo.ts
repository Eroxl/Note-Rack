import express from 'express';

import verifyPermissions from '../../middleware/verifyPermissions';
import type { PageRequest } from '../../middleware/verifyPermissions';

const router = express.Router();

router.get(
  '/get-page-info/:page',
  verifyPermissions(['read']),
  async (req: PageRequest, res) => {
    const pageData = req.pageData;

    res.statusCode = 200;
    res.json({
      status: 'success',
      message: {
        style: pageData.style,
      },
    });
  },
);

export default router;
