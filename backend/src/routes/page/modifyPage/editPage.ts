import express from 'express';
import { SessionRequest } from 'supertokens-node/framework/express';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';

import PageTreeModel from '../../../models/pageTreeModel';
import PageMapModel from '../../../models/pageMap';
import PageModel from '../../../models/pageModel';

const router = express.Router();

router.patch(
  '/:page/',
  verifySession(),
  async (req: SessionRequest, res) => {
    const username = req.session!.getUserId();
    const { style } = req.body;
    const { page } = req.params;

    if (!username) {
      res.statusCode = 401;
      res.json({
        status: 'error',
        message: 'Please login to view this page!',
      });
      return;
    }

    const pageData = await PageModel.findOne({ _id: page, user: username }, 'user').lean();

    if (!pageData) {
      res.statusCode = 404;
      res.json({
        status: 'error',
        message: 'You do not have access to this page or it does not exist...',
      });
      return;
    }

    const formattedStyleProps = Object.fromEntries(Object.keys(style).map((styleElement) => [`style.${styleElement}`, style[styleElement]]));

    await PageModel.updateOne(
      {
        _id: page,
      },
      {
        $set: {
          ...formattedStyleProps,
        },
      },
    );

    const pageMap = await PageMapModel.findById(page).lean();

    const arrayFilters: Record<string, unknown>[] = [];
    let queryString = 'subPages';

    if (pageMap) {
      pageMap.pathToPage.push(page);

      pageMap.pathToPage.forEach((element: string, index: number) => {
        arrayFilters.push({
          [`a${index}._id`]: element,
        });

        if (index < (pageMap.pathToPage.length - 1)) {
          queryString += `.$[a${index}].subPages`;
        } else {
          queryString += `.$[a${index}]`;
        }
      });
    }

    const formattedStylePropsForTree = Object.fromEntries(Object.keys(style).map((styleElement) => [`${queryString}.style.${styleElement}`, style[styleElement]]));

    await PageTreeModel.updateOne(
      {
        _id: username,
      },
      {
        $set: {
          ...formattedStylePropsForTree,
        },
      },
      {
        arrayFilters,
      },
    );

    res.statusCode = 200;
    res.json({
      status: 'success',
      message: {
        statusMessage: 'Succesfully edited block',
      },
    });
  },
);

export default router;
