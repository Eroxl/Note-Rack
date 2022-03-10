import express from 'express';

import editPage from './editPage';

const router = express.Router();

router.use(
  '/',
  editPage,
);

export default router;
