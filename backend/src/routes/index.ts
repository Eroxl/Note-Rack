import express from 'express';

import createRouter from './create/index';

const router = express.Router();

// -=- Creation API -=-
router.use(
  '/create/',
  createRouter,
);

export default router;
