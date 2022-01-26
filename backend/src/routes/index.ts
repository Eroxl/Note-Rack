import express from 'express';

import accountRouter from './account/index';

const router = express.Router();

// -=- Account API -=-
router.use(
  '/account/',
  accountRouter,
);

export default router;
