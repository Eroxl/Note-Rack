import express from 'express';

import pageRouter from './page/index';
import accountRouter from './account/index';

const router = express.Router();

// -=- Account API -=-
router.use(
  '/account/',
  accountRouter,
);

// -=- Pages API -=-
router.use(
  '/page/',
  pageRouter,
);

export default router;
