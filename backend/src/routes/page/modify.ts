import express from 'express';

import verifyPermissions from '../../middleware/verifyPermissions';
import type { PageRequest } from '../../middleware/verifyPermissions';
import queryAggregator from '../../helpers/operations/queryAggregator';
import queryGenerator from '../../helpers/operations/queryGenerators';

const router = express.Router();

router.post(
  '/modify/:page',
  verifyPermissions(['write']),
  async (req: PageRequest, res) => {
    const { page } = req.params;

    // -=- If the user has permissions start updating the page -=-
    const { operations } = req.body;

    if (!operations) {
      res.statusCode = 400;
      res.json({
        status: 'error',
        message: 'No operations were provided...',
      });
      return;
    }

    res.statusCode = 200;
    res.json({
      status: 'success',
      message: 'Page updated successfully...',
    });

    // -=- Update the page -=-
    queryAggregator(
      queryGenerator(operations),
      page,
    );
  },
);

export default router;
