import OpenAIClient from './clients/OpenAIClient';
import ChromaClient from './clients/ChromaClient';

import type { ChatCompletionRequestMessage } from 'openai';

const CONTEXT_PROMPT_TEMPLATE = '### Context: ';

const QUESTION_PROMPT_TEMPLATE = '### Question: ';

const PRE_PROMPT = `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
Try to keep your answers helpful, short and to the point using markdown formatting.`;

interface QueryResponse {
  ids: string[][];
  documents: string[][];
  metadatas: {
    userID: string;
    context: string[];
  }[][];
}

interface GetQueryResponse {
  ids: string[];
  documents: string[];
  metadatas: {
    userID: string;
    context: string[];
  }[];
}

const getChatResponse = async (
  messages: ChatCompletionRequestMessage[],
  question: string,
  user: string
): Promise<string> => {
  const blockCollection = await ChromaClient.getCollection('blocks');

  // ~ Create an embedding for the latest message
  const embeddings = await OpenAIClient.createEmbedding({
    input: question,
    model: 'text-embedding-ada-002',
  });

  try {
    // ~ Query the database for the most similar message
    const similarMessages = await blockCollection.query(
      embeddings.data.data[0].embedding,
      1,
      {
        userID: user,
      },
    ) as QueryResponse;

    // ~ If there are no similar messages, return a default message
    if (!similarMessages.documents) {
      return 'I don\'t know what to say.';
    }

    // ~ Get the context messages
    const contextIDs = Array.from(
      new Set(
        similarMessages.metadatas
          .flat()
          .flatMap((metadata) => metadata.context)
      )
    )

    const contextMessages = await blockCollection.get(
      contextIDs,
      {
        userID: user,
      }
    ) as GetQueryResponse;

    const contextMessagesMap: Record<string, string> = {};

    contextMessages.documents.forEach((document, index) => {
      contextMessagesMap[contextMessages.ids[index]] =  document;
    });

    const context = similarMessages.metadatas
      .flat(2)
      .flatMap((metadata) => metadata.context)
      .map((id) => contextMessagesMap[id])
      .filter((message) => message)
      .map((message) => message.trim())
      .join('\n')

    
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
