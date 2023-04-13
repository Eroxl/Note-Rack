import OpenAIClient from './clients/OpenAIClient';
import ChromaClient from './clients/ChromaClient';

import type { ChatMessage } from '../routes/account/chat';

interface QueryResponse {
  ids: string[][];
  metadatas: string[][];
}

const getChatResponse = async (messages: ChatMessage[]): Promise<string> => {
  const latestMessage = messages[messages.length - 1];

  if (latestMessage.type === 'bot') {
    return latestMessage.message;
  }

  const blockCollection = await ChromaClient.getCollection('blocks');

  const embeddings = await OpenAIClient.createEmbedding({
    input: latestMessage.message,
    model: 'text-embedding-ada-002',
  });

  const query = await blockCollection.query(
    embeddings.data.data[0].embedding,
    1,
  ) as QueryResponse;

  return query.metadatas.map((metadata) => metadata[0]).join('\n\n');
}

export default getChatResponse;
