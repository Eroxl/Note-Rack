import express from 'express';

import createPage from './createPage';

const router = express.Router();

// -=- Create Page API -=-
router.post(
  '/create-page',
  createPage,
);

export default router;
