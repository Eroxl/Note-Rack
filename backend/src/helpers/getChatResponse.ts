import { DataType } from '@zilliz/milvus2-sdk-node/dist/milvus';
import type { ChatCompletionRequestMessage } from 'openai';
import type { Response } from 'express';

import OpenAIClient from './clients/OpenAIClient';
import MilvusClient from './clients/MilvusClient';


const RELATIVE_TEXT_COUNT = 3;

const CONTEXT_PROMPT_TEMPLATE = '### Context: ';

const QUESTION_PROMPT_TEMPLATE = '### Question: ';

const PRE_PROMPT = `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
The user will never directly reference the context, but it is there to help you answer the question.
Try to keep your answers helpful, short and to the point. Answers should be no longer than 3 sentences.
Any math equations should be written in KaTeX and surrounded by a single $ on each side.`;

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

  // ~ Load the block collection
  await MilvusClient!.loadCollection({
    collection_name: 'blocks',
  });

  // ~ Create an embedding for the latest message
  const embeddings = await OpenAIClient!.createEmbedding({
    input: question,
    model: 'text-embedding-ada-002',
  });

  try {
    const similarMessages = await MilvusClient!.search({
      collection_name: 'blocks',
      limit: RELATIVE_TEXT_COUNT,
      vector_type: DataType.FloatVector,
      params: {
        topk: `${RELATIVE_TEXT_COUNT}`,
        metric_type: "L2",
        params: JSON.stringify({ nprobe: 10 }),
      },
      vector: embeddings.data.data[0].embedding,
      expr: `page_id == \"${page}\"`,
      output_fields: ['content', 'context']
    })

    // ~ If there are no similar messages, return a default message
    if (similarMessages.status.reason !== '') {
      throw new Error(similarMessages.status.reason);
    }

    // ~ Get the context messages
    const contextIDs = Array.from(
      new Set(
        similarMessages.results
          .flat()
          .flatMap((metadata) => JSON.parse((metadata.context as string).replace('\\"', '"')) as string[])
          .map((id) => `"${id}"`)
      )
    );

    const contextMessages = await MilvusClient!.query({
      collection_name: 'blocks',
      expr: `block_id in [${contextIDs.join(', ')}]`,
      output_fields: ['content', 'block_id'],
    })

    const contextMessagesMap: Record<string, string> = {};

    contextMessages.data.forEach((result) => {
      contextMessagesMap[result.block_id] =  result.content;
    });

    const context = similarMessages.results
      .map((result) => result.context)
      .flatMap((context) => JSON.parse((context as string).replace('\\"', '"')) as string[])
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
            ...messages,
            {
              role: 'system',
              content: PRE_PROMPT
            },
            {
              role: 'system',
              content: `${CONTEXT_PROMPT_TEMPLATE}${context}`
            },
            {
              role: 'user',
              content: `${QUESTION_PROMPT_TEMPLATE}${question}`
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

      const processResult = (result: ReadableStreamReadResult<Uint8Array>) => {
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

        reader.read().then(processResult);
      };

      reader.read().then(processResult);
    });
  } catch (error) {
    response.statusCode = 500;
    response.json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
}

export default getChatResponse;
