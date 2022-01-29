import express from 'express';

import getHomePage from './getHomePage';
import editPage from './editPage';
import getPage from './getPage';

const router = express.Router();

// -=- Create Get Home Page API -=-
router.use(
  '/',
  getHomePage,
);

// -=- Create Edit Page API -=-
router.use(
  '/',
  editPage,
);

// -=- Create Get Page API -=-
router.use(
  '/',
  getPage,
);

export default router;
