import express from 'express';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';

import OpenAIClient from '../../helpers/clients/OpenAIClient';

const router = express.Router();

router.get(
  '/complete',
  verifySession(),
  async (req, res) => {
    const { context } = req.query;

    if (process.env.NEXT_PUBLIC_IS_CHAT_ENABLED === 'false') {
      res.statusCode = 401;
      res.json({
        status: 'error',
        message: 'Chat is not enabled!',
      });
      return;
    }

    if (typeof context !== 'string' || !context) {
      res.statusCode = 401;
      res.json({
        status: 'error',
        message: 'Please enter a context!',
      });
      return;
    }

    const response = await OpenAIClient!.createCompletion({
      model: 'text-davinci-003',
      prompt: context,
      max_tokens: 10,
      n: 1,
    });

    res.statusCode = 200;
    res.json({
      status: 'success',
      message: response.data.choices[0].text || '',
    });
  },
);

export default router;
