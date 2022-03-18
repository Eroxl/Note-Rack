import express from 'express';

import addPage from './addPage';
import editPage from './editPage';
import deletePage from './deletePage';

const router = express.Router();

router.use(
  '/',
  editPage,
);

router.use(
  '/',
  addPage,
);

router.use(
  '/',
  deletePage,
);

export default router;
