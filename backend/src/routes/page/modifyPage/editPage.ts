import express from 'express';

import PageTreeModel from '../../../models/pageTreeModel';
import PageMapModel from '../../../models/pageMap';
import PageModel from '../../../models/pageModel';
import verifyPermissions from '../../../middleware/verifyPermissions';
import type { PageRequest } from '../../../middleware/verifyPermissions';

const router = express.Router();

router.patch(
  '/:page/',
  verifyPermissions(['admin']),
  async (req: PageRequest, res) => {
    const { style } = req.body;
    const { page } = req.params;
    const pageData = req.pageData!;

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

    const pageOwner = pageData.user;

    await PageTreeModel.updateOne(
      {
        _id: pageOwner,
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
