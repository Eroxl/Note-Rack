import express from 'express';

import getHomePage from './getHomePage';
import getPage from './getPage';

const router = express.Router();

// -=- Create Get Home Page API -=-
router.use(
  '/',
  getHomePage,
);

// -=- Create Get Page API -=-
router.use(
  '/',
  getPage,
);

export default router;
