import express from 'express';

import addBlock from './addBlock';
import editBlock from './editBlock';

const router = express.Router();

router.use(
  '/',
  editBlock,
);

router.use(
  '/',
  addBlock,
);

export default router;
