import MilvusClient from './clients/MilvusClient';
import OpenAIClient from './clients/OpenAIClient';

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
  await MilvusClient.loadCollection({
    collection_name: 'blocks'
  });

  const updateOperations = updates.filter((update) => update.type === 'update');

  const embeddings = await OpenAIClient.createEmbedding({
    input: updateOperations.map((operation) => operation.value),
    model: 'text-embedding-ada-002',
  });

  const fieldsData = new Array(updateOperations.length)
    .fill(undefined)
    .map((_, index) => ({
      block_id: updateOperations[index].id,
      page_id: page,
      embedding: embeddings.data.data[index].embedding,
      content: updateOperations[index].value,
      context: JSON.stringify(updateOperations[index].context),
    }));


  await MilvusClient.insert({
    collection_name: 'blocks',
    fields_data: fieldsData
  });

  const deleteOperations = updates.filter((update) => update.type === 'delete');

  await MilvusClient.deleteEntities({
    collection_name: 'blocks',
    expr: `block_id in [${deleteOperations.map((operation) => operation.id).join(', ')}]`,
  });

  await MilvusClient.flush({
    collection_names: ['blocks'],
  });
};

export default refreshEmbeds;
