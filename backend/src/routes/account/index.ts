import express from 'express';

import refreshToken from './refreshToken';
import register from './register';
import login from './login';

const router = express.Router();

// -=- Create Refresh Token API -=-
router.use(
  '/',
  refreshToken,
);

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

export default router;
