import express from 'express';

import modifyPage from './modifyPage';
import modify from './modify';
import getHomePage from './getHomePage';
import getPage from './getPage';
import getPageInfo from './getPageInfo';
import updatePermissions from './updatePermissions';
import chat from './chat';
import complete from './complete';
import exportFile from './export';

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

// -=- Create Modify Block API -=-
router.use(
  '/',
  modify,
);

// -=- Create Update Permissions API -=-
router.use(
  '/',
  updatePermissions,
);

// -=- Create Chat API -=-
router.use(
  '/',
  chat,
);

// -=- Create Autocomplete API -=-
router.use(
  '/',
  complete,
);

// -=- Create Modify Page API -=-
router.use(
  '/modify-page/',
  modifyPage,
);

// -=- Create Export API -=-
router.use(
  '/',
  exportFile,
);

export default router;
