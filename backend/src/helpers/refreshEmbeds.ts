import OpenAIClient from './clients/OpenAIClient';
import QdrantClient from './clients/QDrantClient';

export interface EmbedOperation {
  type: 'update' | 'delete';
  id: string;
  context: string[];
  value?: string;
}

/**
 * Update the embeds on a page in chunks.
 *
 * @param page The page to update the embeds for.
 * @param pageData The page data of the page that is being updated.
 */
const refreshEmbeds = async (updates: EmbedOperation[], page: string) => {
  await QdrantClient!.deletePoints(
    'blocks',
    {
      must: [
        {
          key: 'block_id',
          match: {
            any: updates.map((operation) => operation.id)
          },
        },
        {
          key: 'page_id',
          match: {
            value: page,
          }
        }
      ],
    },
  );

  const updateOperations = updates.filter((update) => update.type === 'update');

  if (!updateOperations.length) {
    return;
  }

  const embeddings = await OpenAIClient!.createEmbedding({
    input: updateOperations.map((operation) => operation.value),
    model: 'text-embedding-ada-002',
  });

  const fieldsData = new Array(updateOperations.length)
    .fill(undefined)
    .map((_, index) => ({
      id: Math.floor(Math.random() * 2 ** 64),
      vector: embeddings.data.data[index].embedding,
      payload: {
        block_id: updateOperations[index].id,
        page_id: page,
        content: updateOperations[index].value,
        context: updateOperations[index].context,
      },
    }));

  await QdrantClient!.upsertPoints('blocks', fieldsData);
};

export default refreshEmbeds;
