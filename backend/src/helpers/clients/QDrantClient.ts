import type { QDrantClient } from './QDrantClient.d';

let qdrantClient: QDrantClient | undefined;

if (process.env.NEXT_PUBLIC_IS_CHAT_ENABLED !== 'false') {

  if (!process.env.QDRANT_URL) {
    throw new Error('QDRANT_URL is not defined');
  }

  /**
   * Create a QDrant client
   * @param baseURL The base URL of the QDrant API
   * @param apiKey The API key to use for the QDrant API
   * @returns A QDrant client
   */
  const createQDrantClient = (baseURL: string, apiKey?: string): QDrantClient => ({
    getCollections: async () => {
      const response = await fetch(`${baseURL}/collections`, {
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
        },
      });

      if (response.status !== 200) {
        return undefined;
      }

      const collections = (await response.json()).result.collections as { name: string }[];

      return collections.map((collection) => collection.name);
    },

    createCollection: async (collection, vectors) => {
      const response = await fetch(`${baseURL}/collections/${collection}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({
          vectors,
        }),
      });

      return response.status === 200;
    },

    searchPoints: async (collection, vector, limit, filter, with_payload) => {
      const response = await fetch(`${baseURL}/collections/${collection}/points/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({
          vector,
          filter,
          limit,
          with_payload,
        }),
      });

      if (response.status !== 200) {
        return undefined;
      }

      const { result } = await response.json();

      return result;
    },

    deletePoints: async (collection, filter, points) => {
      if (!filter && !points) {
        throw new Error('Either filter or points must be provided');
      }

      if (filter && points) {
        throw new Error('Only one of filter or points must be provided');
      }

      const response = await fetch(`${baseURL}/collections/${collection}/points/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({
          filter,
          points,
        }),
      });

      return response.status === 200;
    },

    upsertPoints: async (collection, vectors) => {
      console.log(vectors);

      const response = await fetch(`${baseURL}/collections/${collection}/points`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({
          points: vectors,
        }),
      });

      console.log(await response.json())

      return response.status === 200;
    }
  });

  qdrantClient = createQDrantClient(process.env.QDRANT_URL, process.env.QDRANT_API_KEY);

  (async () => {
    const collections = await qdrantClient?.getCollections();

    if (!(collections?.find((collection) => collection === 'blocks'))) {
      console.warn('Collection "blocks" does not exist. Creating it...')

      const status = await qdrantClient?.createCollection('blocks', {
        distance: 'Cosine',
        size: 1536,
        hnsw_config: {
          on_disk: true,
        }
      });

      if (!status) {
        throw new Error('Failed to create blocks collection');
      }

      console.warn('Collection "blocks" created successfully');
    }
  })();
}

export default qdrantClient;
