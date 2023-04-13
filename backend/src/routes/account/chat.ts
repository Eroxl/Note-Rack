import express from 'express';
import type { SessionRequest } from 'supertokens-node/framework/express';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';

import getChatResponse from '../../helpers/getChatResponse';

const router = express.Router();

export interface ChatMessage {
  type: 'bot' | 'user' | 'context',
  message: string,
}

router.get(
  '/chat',
  verifySession(),
  async (req: SessionRequest, res) => {
    const { message, previousMessages } = req.query;

    if (typeof message !== 'string') {
      res.statusCode = 401;
      res.json({
        status: 'error',
        message: 'Please enter a message!',
      });
      return;
    }

    if (previousMessages && typeof previousMessages !== 'string') {
      res.statusCode = 401;
      res.json({
        status: 'error',
        message: 'Please enter a valid previousMessages!',
      });
      return;
    }

    let messages: ChatMessage[] = [];

    if (previousMessages) {
      try {
        const parsedPreviousMessages = JSON.parse(previousMessages) as ChatMessage[];

        if (!Array.isArray(parsedPreviousMessages)) throw new Error('previousMessages is not an array');

        messages = parsedPreviousMessages.slice(-10);
      } catch (e) {
        res.statusCode = 401;
        res.json({
          status: 'error',
          message: 'Please enter a valid previousMessages!',
        });
        return;
      }
    }

    messages.push({
      type: 'user',
      message,
    });

    if (messages.length > 10) {
      messages = messages.slice(-10);
    }

    const response = await getChatResponse(messages);

    messages.push({
      type: 'bot',
      message: response,
    });

    res.statusCode = 200;
    res.json({
      status: 'success',
      messages: messages.slice(-10),
    });
  },
)

export default router;