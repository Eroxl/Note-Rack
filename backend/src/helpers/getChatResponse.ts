import type { ChatCompletionRequestMessage } from 'openai';
import type { Response } from 'express';

import OpenAIClient from './clients/OpenAIClient';
import { ReadableStreamDefaultReadResult } from 'stream/web';
import QdrantClient from './clients/QDrantClient';


const RELATIVE_TEXT_COUNT = 3;

// SOURCE: https://github.com/mayooear/gpt4-pdf-chatbot-langchain/blob/main/utils/makechain.ts
const CONDENSER_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const PRE_PROMPT = `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
The user will never directly reference the context, but it is there to help you answer the question.
Try to keep your answers helpful, short and to the point. Answers should be no longer than 3 sentences.
Any math equations should be written in KaTeX and surrounded by a single $ on each side

Context: {context}

Question: {question}
Helpful answer:`;

const getChatResponse = async (
  messages: ChatCompletionRequestMessage[],
  question: string,
  page: string,
  response: Response,
): Promise<void> => {
  if (process.env.NEXT_PUBLIC_IS_CHAT_ENABLED === 'false') {
    response.statusCode = 401;
    response.json({
      status: 'error',
      message: 'Chat is not enabled!',
    });
    return;
  }
  // ~ Condense the context
  const condensedQuestionResponse = await OpenAIClient!.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: CONDENSER_PROMPT
          .replace('{chat_history}', JSON.stringify(messages))
          .replace('{question}', question)
      }
    ]
  });

  const condensedQuestion = condensedQuestionResponse.data.choices[0].message?.content;

  // ~ Create an embedding for the latest message
  const embeddings = await OpenAIClient!.createEmbedding({
    input: condensedQuestion || question,
    model: 'text-embedding-ada-002',
  });

  try {
    const similarMessages = await (await QdrantClient!.searchPoints('blocks', undefined, {
      vector: embeddings.data.data[0].embedding as any,
      limit: RELATIVE_TEXT_COUNT,
      filter: {
        must: [
          {
            key: 'page_id',
            match: {
              value: page,
            }
          } as any,
        ]
      },
      with_payload: {
        include: ['context'],
      } as any,
    }))();

    // ~ If there are no similar messages, return a default message
    if (similarMessages.status !== 200 || !similarMessages.data.result?.length) {
      response.statusCode = 200;
      response.send('I\'m sorry, I don\'t know the answer to that question yet, write some text in this page to help me learn!');
      return;
    }

    // ~ Get the context messages
    const contextIDs = Array.from(
      new Set(
        similarMessages.data.result
          .flatMap((result) => (result.payload as any)?.context as string[])
      )
    );

    const contextMessages = await (await QdrantClient!.searchPoints('blocks', undefined, {
      vector: embeddings.data.data[0].embedding as any,
      filter: {
        must: [
          {
            key: 'block_id',
            match: {
              any: contextIDs,
            },
          },
          {
            key: 'page_id',
            match: {
              value: page,
            },
          }
        ],
      },
      with_payload: {
        include: ['content', 'block_id'],
      },
      limit: contextIDs.length,
    } as any))();

    console.log(contextMessages.data.result);

    const contextMessagesMap: Record<string, string> = {};

    contextMessages.data.result?.forEach((result) => {
      if (!(result.payload as any)?.block_id) return;
      
      contextMessagesMap[(result.payload as any)?.block_id] = (result.payload as any)?.content;
    });

    const context = similarMessages.data.result
      .flatMap((result) => (result.payload as any).context as string[])
      .map((id) => contextMessagesMap[id])
      .filter((message) => message)
      .map((message) => message.trim())
      .join('\n')

    // ~ Create the chat completion
    fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          stream: true,
          messages: [
            {
              role: 'user',
              content: PRE_PROMPT
                .replace('{context}', context)
                .replace('{question}', condensedQuestion || question)
            }
          ]
        }),
      }
    ).then((completionResponse) => {
      const reader = completionResponse.body?.getReader();
    
      if (!reader) {
        throw new Error('No reader found');
      }

      response.writeHead(200, {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked'
      });

      const decoder = new TextDecoder();

      let chunk = '';

      const processResult = (result: ReadableStreamDefaultReadResult<Uint8Array>) => {
        chunk += decoder.decode(result.value, { stream: true });

        const dataObjects = chunk.split('\n').filter(Boolean);

        const latestData = dataObjects[dataObjects.length - 1].replace(/^data: /, '');

        if (latestData === '[DONE]') {
          reader.cancel();
          response.end();

          return;
        }

        const jsonData = JSON.parse(latestData);

        if (jsonData.choices && jsonData.choices[0].delta.content) {
          const responseMessage = jsonData.choices[0].delta.content;

          response.write(responseMessage);
        }

        reader.read().then(processResult as any);
      };

      reader.read().then(processResult as any);
    });
  } catch (error) {
    console.error(error);

    response.statusCode = 500;
    response.send('Something went wrong!')
  }
}

export default getChatResponse;
