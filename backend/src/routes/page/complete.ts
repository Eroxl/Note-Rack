import express from 'express';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';

import OpenAIClient from '../../helpers/clients/OpenAIClient';

const router = express.Router();

const AUTOCOMPLETE_PROMPT = `You are a helpful AI assistant. Use the following pieces of context to complete the text at the end.
DO NOT repeat the context. Only complete it.

Context: {{context}}`;

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

    const prompt = AUTOCOMPLETE_PROMPT.replace('{{context}}', context);

    const response = await OpenAIClient!.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        }
      ],
      max_tokens: 10,
    });

    res.statusCode = 200;
    res.json({
      status: 'success',
      message: response.data.choices[0].message?.content,
    });
  },
);

export default router;
