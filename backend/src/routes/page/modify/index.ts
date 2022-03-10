import express from 'express';

import addBlock from './addBlock';
import editBlock from './editBlock';
import deleteBlock from './deleteBlock';

const router = express.Router();

router.use(
  '/',
  editBlock,
);

router.use(
  '/',
  addBlock,
);

router.use(
  '/',
  deleteBlock,
);

export default router;
