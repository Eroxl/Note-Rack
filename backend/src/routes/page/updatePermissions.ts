import express from 'express';
import ThirdParty from 'supertokens-node/recipe/thirdparty';

import PageModel from '../../models/pageModel';
import verifyPermissions from '../../middleware/verifyPermissions';

const router = express.Router();

router.post(
  '/update-permissions/:page/',
  verifyPermissions(['admin']),
  async (req, res) => {
    const { page } = req.params;
    const { email, permissions } = req.body;

    // -=- If the user has permissions start updating the page -=-
    if (!email || !permissions) {
      res.statusCode = 400;
      res.json({
        status: 'error',
        message: 'No email or permissions were provided...',
      });
      return;
    }

    // ~ Get the user ID from the email
    const userId = (await ThirdParty.getUsersByEmail(email)).map((user) => user.id);

    if (!userId || userId.length === 0) {
      res.statusCode = 404;
      res.json({
        status: 'error',
        message: 'This user does not exist...',
      });
      return;
    }

    await PageModel.findByIdAndUpdate(
      page,
      {
        $set: {
          [`permissions.${userId[0]}`]: permissions,
        },
      },
    );

    res.statusCode = 200;
    res.json({
      status: 'success',
      message: 'Page updated successfully...',
    });
  },
);

export default router;
