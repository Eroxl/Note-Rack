import express from 'express';

import createRouter from './create/index';
import accountRouter from './account/index';

const router = express.Router();

// -=- Creation API -=-
router.use(
  '/create/',
  createRouter,
);

// -=- Account API -=-
router.use(
  '/account/',
  accountRouter,
);

export default router;
