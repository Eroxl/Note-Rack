import express from 'express';

import createPage from './createPage';

const router = express.Router();

// -=- Create Page API -=-
router.use(
  '/',
  createPage,
);

export default router;
