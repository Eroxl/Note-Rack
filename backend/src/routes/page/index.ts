import express from 'express';

import modifyPage from './modifyPage';
import modify from './modify';
import getHomePage from './getHomePage';
import getPage from './getPage';
import getPageInfo from './getPageInfo';

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

// -=- Create Get Page Info API -=-
router.use(
  '/',
  getPageInfo,
);

// -=- Create The Edit Route -=-
router.use(
  '/modify/',
  modify,
);

// -=- Create The Edit Page Route -=-
router.use(
  '/modify-page/',
  modifyPage,
);

export default router;
