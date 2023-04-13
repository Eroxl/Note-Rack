import express from 'express';

import editPageTreeExpansion from './editPageTreeExpansion';
import getPageTree from './getPageTree';
import search from './search';
import chat from './chat';

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

// -=- Create Search API -=-
router.use(
  '/',
  search,
);

// -=- Create Chat API -=-
router.use(
  '/',
  chat,
);

export default router;
