import express from 'express';

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

export default router;
