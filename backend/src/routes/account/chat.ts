import express from 'express';
import type { SessionRequest } from 'supertokens-node/framework/express';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';

import type { ChatCompletionRequestMessage } from 'openai';

import getChatResponse from '../../helpers/getChatResponse';

const router = express.Router();

router.get(
  '/chat',
  verifySession(),
  async (req: SessionRequest, res) => {
    const { message, previousMessages, pageID } = req.query;

    if (process.env.NEXT_PUBLIC_IS_CHAT_ENABLED === 'false') {
      res.statusCode = 401;
      res.json({
        status: 'error',
        message: 'Chat is not enabled!',
      });
      return;
    }

    if (typeof message !== 'string') {
      res.statusCode = 401;
      res.json({
        status: 'error',
        message: 'Please enter a message!',
      });
      return;
    }

    if (typeof pageID !== 'string') {
      res.statusCode = 401;
      res.json({
        status: 'error',
        message: 'Please enter a pageID!',
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

    let messages: ChatCompletionRequestMessage[] = [];

    if (previousMessages) {
      try {
        const parsedPreviousMessages = JSON.parse(previousMessages) as ChatCompletionRequestMessage[];

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

    if (messages.length > 10) {
      messages = messages.slice(-10);
    }

    await getChatResponse(
      messages,
      message,
      pageID,
      res
    );
  }
)

export default router;