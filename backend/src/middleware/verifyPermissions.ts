import { Response, NextFunction } from 'express';
import { SessionRequest } from 'supertokens-node/framework/express';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';

import PageModel from '../models/pageModel';
import type { IPage } from '../models/pageModel';

type ValidPermissions =  'read' | 'write' | 'admin';

export interface PageRequest extends SessionRequest {
  pageData?: IPage,
  permissions?: ValidPermissions[],
}

const verifyPermissions = (permissions: ValidPermissions[]) => {
  const verifyPermissionsMiddleware = async (req: PageRequest, res: Response, next: NextFunction) => {
    const { page } = req.params;
    
    if (!req.session) {
      throw new Error('No session provided to middleware!');
    }

    if (!page) {
      res.statusCode = 400;
      res.json({
        status: 'error',
        message: 'No page was provided...',
      });
      return;
    }

    const username = req.session.getUserId();
    
    if (!username) {
      res.statusCode = 401;
      res.json({
        status: 'error',
        message: 'Please login to modify this page!',
      });
      return;
    }

    const pageData = await PageModel.findOne({ _id: page }).lean();

    if (!pageData) {
      res.statusCode = 404;
      res.json({
        status: 'error',
        message: 'This page does not exist...',
      });
      return;
    }

    if (pageData.user === username) {
      req.pageData = pageData;

      req.permissions = ['admin', 'write', 'read'];
      next();

      return;
    }

    console.log(pageData.permissions);

    const userPermissionsOnPage = pageData.permissions[username] || undefined;

    if (!userPermissionsOnPage) {
      res.statusCode = 403;
      res.json({
        status: 'error',
        message: 'You do not have access to this page...',
      });
      return;
    }

    const hasPermission = permissions.every((permission) => userPermissionsOnPage[permission]);

    if (!hasPermission) {
      res.statusCode = 403;
      res.json({
        status: 'error',
        message: 'You do not have access to this page...',
      });
      return;
    }

    req.pageData = pageData;
    req.permissions = Object
      .entries(userPermissionsOnPage)
      .filter(([_, value]) => value === true)
      .map(([key, _]) => key as ValidPermissions);

    next();
  };

  const middleware = async (req: SessionRequest, res: Response, next: NextFunction) => {
    verifySession()(
      req,
      res,
      () => verifyPermissionsMiddleware(req, res, next),
    );
  };

  return middleware;
}

export default verifyPermissions;
