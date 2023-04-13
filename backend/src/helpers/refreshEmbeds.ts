import ChromaClient from './clients/ChromaClient';
import OpenAIClient from './clients/OpenAIClient';

export interface EmbedOperation {
  type: 'update' | 'delete';
  id: string;
  value?: string;
}

/**
 * Update the embeds on a page in chunks.
 *
 * @param page The page to update the embeds for.
 * @param pageData The page data of the page that is being updated.
 */
const refreshEmbeds = async (updates: EmbedOperation[], page: string, pageOwner: string) => {
  const blockCollection = await ChromaClient.getCollection('blocks');

  await blockCollection.delete(
    updates.map((operation) => `${page}.${operation.id}`),
  );

  const updateOperations = updates.filter((update) => update.type === 'update');

  const embeddings = await OpenAIClient.createEmbedding({
    input: updateOperations.map((operation) => operation.value),
    model: 'text-embedding-ada-002',
  });

  await blockCollection.add(
    updateOperations.map((operation) => operation.id),
    embeddings.data.data.map((embedding) => embedding.embedding),
    updateOperations.map((operation) => operation.value),
  );
};

export default refreshEmbeds;
