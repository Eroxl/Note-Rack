import OpenAIClient from './clients/OpenAIClient';
import ChromaClient from './clients/ChromaClient';

import type { ChatMessage } from '../routes/account/chat';

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

const getChatResponse = async (messages: ChatMessage[], user: string): Promise<string> => {
  const latestMessage = messages[messages.length - 1];

  if (latestMessage.type === 'bot') {
    return latestMessage.message;
  }

  const blockCollection = await ChromaClient.getCollection('blocks');

  const embeddings = await OpenAIClient.createEmbedding({
    input: latestMessage.message,
    model: 'text-embedding-ada-002',
  });

  try {
    const query = await blockCollection.query(
      embeddings.data.data[0].embedding,
      1,
      {
        userID: user,
      },
    ) as QueryResponse;

    if (!query.documents) {
      return 'I don\'t know what to say.';
    }

    const context = Array.from(new Set(query.metadatas[0].flatMap((metadata) => metadata.context)));

    const contextMessages = await blockCollection.get(
      context,
      {
        userID: user,
      }
    ) as GetQueryResponse;

    const contextMessagesMap: Record<string, string> = {};

    contextMessages.documents.forEach((document, index) => {
      contextMessagesMap[contextMessages.ids[index]] =  document;
    });

    return query.metadatas
      .flat(2)
      .flatMap((metadata) => metadata.context)
      .map((id) => contextMessagesMap[id])
      .filter((message) => message)
      .map((message) => message.trim())
      .join('\n')
  } catch (error) {
    console.log(error);

    return 'I don\'t know what to say.';
  }
}

export default getChatResponse;
