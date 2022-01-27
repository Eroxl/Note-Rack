import express from 'express';

import getHomePage from './getHomePage';

const router = express.Router();

// -=- Create Get Home Page API -=-
router.use(
  '/',
  getHomePage,
);

export default router;
