import express from 'express';

import verifyPermissions from '../../middleware/verifyPermissions';
import type { PageRequest } from '../../middleware/verifyPermissions';

const router = express.Router();

router.get(
  '/get-page/:page',
  verifyPermissions(['read']),
  async (req: PageRequest, res) => {
    const pageData = req.pageData!;
    const permissions = req.permissions!;

    res.statusCode = 200;
    res.json({
      status: 'success',
      message: {
        style: pageData.style,
        data: pageData.data,
        ...(
          permissions.includes('admin')
            ? { permissions: pageData.permissions }
            : {}
        )
      },
    });
  },
);

export default router;
