import express from 'express';

import verifyPermissions from '../../middleware/verifyPermissions';
import type { PageRequest } from '../../middleware/verifyPermissions';

import mdExporter from '../../helpers/exporters/mdExporter';

const router = express.Router();

router.get(
  '/export/:page',
  verifyPermissions(['read']),
  async (req: PageRequest, res) => {
    const pageData = req.pageData!;

    const format = req.query.format as string | undefined;

    if (!format) {
      res.statusCode = 400;
      res.json({
        status: 'error',
        message: {
          statusMessage: 'No format specified!',
        },
      });
      return;
    }

    if (format !== 'md') {
      res.statusCode = 400;
      res.json({
        status: 'error',
        message: {
          statusMessage: 'Invalid format specified!',
        },
      });
      return;
    }

    res.setHeader('Access-Control-Expose-Headers','Content-Disposition');

    // ~ NOTE:EROXL: Could re-write this way better but I'm lazy
    if (format === 'md') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.attachment(`${(pageData.style as {name: string})?.name}.md`);
      
      res.send(await mdExporter(pageData));
    }
  },
);

export default router;
