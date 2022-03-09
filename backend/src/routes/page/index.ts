import express from 'express';

import edit from './modify';
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

// -=- Create The Edit Route -=-
router.use(
  '/modify/',
  edit,
);

export default router;
