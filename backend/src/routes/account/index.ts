import express from 'express';

import register from './register';

const router = express.Router();

// -=- Create Page API -=-
router.use(
  '/',
  register,
);

export default router;
