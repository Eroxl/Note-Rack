import express from 'express';

import moveBlock from './moveBlock';

const router = express.Router();

router.use(
  '/',
  moveBlock,
);

export default router;
