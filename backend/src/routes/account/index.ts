import express from 'express';

import editPageTreeExpansion from './editPageTreeExpansion';
import getPageTree from './getPageTree';
import register from './register';
import login from './login';

const router = express.Router();

// -=- Create Register API -=-
router.use(
  '/',
  register,
);

// -=- Create Login API -=-
router.use(
  '/',
  login,
);

// -=- Create Get Page Tree API -=-
router.use(
  '/',
  getPageTree,
);

// -=- Create Edit Page Tree API -=-
router.use(
  '/',
  editPageTreeExpansion,
);

export default router;
