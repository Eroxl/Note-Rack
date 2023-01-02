import express from 'express';

import editPageTreeExpansion from './editPageTreeExpansion';
import getPageTree from './getPageTree';

const router = express.Router();

// -=- Create Get Page Tree API -=-
router.use(
  '/',
  getPageTree,
);

// -=- Create Edit Page Tree API -=-
router.use(
  '/',
  editPageTreeExpansion,
);

export default router;
