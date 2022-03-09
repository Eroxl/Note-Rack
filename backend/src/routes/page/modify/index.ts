import express from 'express';

import editBlock from './editBlock';

const router = express.Router();

router.use(
  '/',
  editBlock,
);

export default router;
