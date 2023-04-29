import { DataType } from '@zilliz/milvus2-sdk-node/dist/milvus';
import type { ChatCompletionRequestMessage } from 'openai';

import OpenAIClient from './clients/OpenAIClient';
import MilvusClient from './clients/MilvusClient';


const RELATIVE_TEXT_COUNT = 3;

const CONTEXT_PROMPT_TEMPLATE = '### Context: ';

const QUESTION_PROMPT_TEMPLATE = '### Question: ';

const PRE_PROMPT = `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
Try to keep your answers helpful, short and to the point using markdown formatting.`;

const getChatResponse = async (
  messages: ChatCompletionRequestMessage[],
  question: string,
  page: string
): Promise<string> => {
  // ~ Load the block collection
  await MilvusClient.loadCollection({
    collection_name: 'blocks',
  });

  // ~ Create an embedding for the latest message
  const embeddings = await OpenAIClient.createEmbedding({
    input: question,
    model: 'text-embedding-ada-002',
  });

  try {
    const similarMessages = await MilvusClient.search({
      collection_name: 'blocks',
      limit: RELATIVE_TEXT_COUNT,
      vector_type: DataType.FloatVector,
      params: {
        topk: `${RELATIVE_TEXT_COUNT}`,
        metric_type: "L2",
        params: JSON.stringify({ nprobe: 10 }),
      },
      vector: embeddings.data.data[0].embedding,
      // expr: `page_id == ${page}`,
      output_fields: ['content', 'context']
    })

    // ~ If there are no similar messages, return a default message
    if (similarMessages.status.reason !== '') {
      return 'I don\'t know what to say.';
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

    const contextMessages = await MilvusClient.query({
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
    
    // ~ TODO: Start adding support for streaming the response
    //         https://www.reddit.com/r/ChatGPT/comments/11m3jdw/chatgpt_api_streaming/
    //         https://gist.github.com/montanaflynn/6a438f0be606daede899
    const response = await OpenAIClient.createChatCompletion({
      messages: [
        {
          role: 'system',
          content: PRE_PROMPT
        },
        ...messages,
        {
          role: 'system',
          content: `${CONTEXT_PROMPT_TEMPLATE}${context}`
        },
        {
          role: 'user',
          content: `${QUESTION_PROMPT_TEMPLATE}${question}`
        }
      ],
      model: 'gpt-3.5-turbo'
    })

    const answer = response.data.choices[0].message?.content;

    if (!answer) {
      return 'I don\'t know what to say.';
    }

    return answer;
  } catch (error) {
    console.log(error);

    return 'I don\'t know what to say.';
  }
}

export default getChatResponse;
