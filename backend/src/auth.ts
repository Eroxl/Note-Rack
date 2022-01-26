import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

const genNewJWT = (user: string): { newSessionToken: string, newRefreshToken: string } => {
  const newSessionToken = jwt.sign({ user }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  const newRefreshToken = jwt.sign({ user }, process.env.JWT_SECRET as string, { expiresIn: '30d' });

  return {
    newSessionToken,
    newRefreshToken,
  };
};

const verifyValidityOfToken: RequestHandler = async (req, res, next) => {
  const {
    'rfrsh-token': refreshToken,
    'ssn-token': sessionToken,
  } = req.cookies;

  // -=- Check main token -=-
  await jwt.verify(sessionToken, process.env.JWT_SECRET as string, (err: unknown, decoded: any) => {
    res.locals.username = decoded ? decoded.user : undefined;
  });

  // -=- If main tokens invalid verify refresh token -=-
  if (!res.locals.username) {
    await jwt.verify(
      refreshToken,
      process.env.JWT_SECRET as string,
      (err: unknown, decoded: any) => {
        res.locals.username = decoded ? decoded.user : undefined;

        if (!err) {
          const { newSessionToken, newRefreshToken } = genNewJWT(res.locals.username);

          res.setHeader('Set-Cookie', `ssn-token=${newSessionToken}; Secure; HttpOnly`);
          res.setHeader('Set-Cookie', `rfrsh-token=${newRefreshToken}; Secure; HttpOnly`);
        }
      },
    );
  }

  console.log(res.locals.username);
  next();
};

export default verifyValidityOfToken;
