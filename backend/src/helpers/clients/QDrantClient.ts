export type QDrantCollectionVector = {
  /**
   * Size of a vectors used in the collection
   */
  size: number;
  /**
   * Type of internal tags, build from payload Distance function types used to
   * compare vectors
   */
  distance: 'Cosine' | 'Euclidean' | 'Dot';
  /**
   * Custom params for HNSW index.
   */
  hnsw_config?: {
    /**
     * Number of edges per node in the index graph.
     * Larger the value - more accurate the search, more space required.
     */
    ef_construct?: number;
    /**
     * Number of neighbours to consider during the index building.
     * Larger the value - more accurate the search, more time required to build the index.
     * Must be >= 4.
     */
    m?: number;
    /**
     * Minimal size (in KiloBytes) of vectors for additional payload-based indexing.
     * If payload chunk is smaller than `full_scan_threshold_kb` additional indexing won't
     * be used - in this case full-scan search should be preferred by query planner and
     * additional indexing is not required. Note: 1Kb = 1 vector of size 256
     * Must be >= 1000.
     */
    full_scan_threshold?: number;
    /**
     * Number of parallel threads used for background index building. If 0 - auto selection.
     * Must be >= 1000.
     */
    max_indexing_threads?: number;
    /**
     * Store HNSW index on disk. If set to false, the index will be stored in RAM.
     */
    on_disk?: boolean;
    /**
     * Custom M param for additional payload-aware HNSW links.
     * If not set, default M will be used.
     */
    payload_m?: number;
  };
}

export type Filter = {
  /**
   * The key of the payload to filter by
   */
  key: string;
  /**
   * The parameters to filter by
   */
  match?: {
    /**
     * The value to match
     */
    value: string | number | boolean;
  } | {
    /**
     * The text to match
     */
    text: string;
  } | {
    /**
     * The values to match
     */
    any: string[];
  },
}

export type QDrantClient = {
  /**
   * Get a list of collections
   * @returns A list of collections by name
   */
  getCollections: () => Promise<string[] | undefined>;

  /**
   * Create a collection
   * @param collection The name of the collection to create
   * @param vectors The vectors to create the collection with
   * @returns Whether the collection was created
   */
  createCollection: (
    collection: string,
    vectors: (
      QDrantCollectionVector
      | {
        [key: string]: QDrantCollectionVector;
      }
    )
  ) => Promise<boolean>;

  /**
   * Search for points in a collection
   * @param collection The name of the collection to search in
   * @param vector The vector to search for
   * @param limit The maximum number of results to return
   * @param filter The filter to apply to the search
   * @param with_payload Whether to return the payload
   * @returns The results of the search
   */
  searchPoints: <
    TUnknownPayload extends boolean | {
      include: (keyof TPayload)[];
    } | {
      exclude: (keyof TPayload)[];
    },
    TPayload extends Record<string, any> = { [key: string]: any },
  >(
    collection: string,
    vector: number[],
    limit: number,
    filter?: {
      must?: Filter[];
      must_not?: Filter[];
      should?: Filter[];
    },
    with_payload?: TUnknownPayload,
  ) => Promise<{
    id: string | number;
    payload: (
      TUnknownPayload extends true
        ? TPayload
        : (
          TUnknownPayload extends {
            include: (keyof TPayload)[];
          }
            ? Pick<TPayload, TUnknownPayload['include'][number]>
            : TUnknownPayload extends {
              exclude: (keyof TPayload)[];
            }
              ? Omit<TPayload, TUnknownPayload['exclude'][number]>
              : never
        )
    ),
  }[] | undefined>;

  /**
   * Delete points from a collection (either by filter or by id)
   * @param collection The name of the collection to delete from
   * @param filter The filter to apply to the deletion
   * @param points The id's of the points to delete
   * @returns Whether the points were deleted
   */
  deletePoints: (
    collection: string,
    filter?: {
      must?: Filter[];
      must_not?: Filter[];
      should?: Filter[];
    },
    points?: string[] | number[],
  ) => Promise<boolean>

  /**
   * Upsert points in a collection
   * @param collection The name of the collection to upsert in
   * @param vectors The vectors to upsert
   * @returns Whether the points were upserted
   */
  upsertPoints: (
    collection: string,
    vectors: {
      id: string | number;
      vector: number[];
      payload?: Record<string, any>;
    }[],
  ) => Promise<boolean>;
}

export type Block = {
  block_id: string;
  page_id: string;
  content: string;
  context: string[];
};

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

      return response.status === 200;
    }
  });

  qdrantClient = createQDrantClient(process.env.QDRANT_URL, process.env.QDRANT_API_KEY);

  (async () => {
    const collections = await qdrantClient?.getCollections();

    if (!(collections?.find((collection) => collection === 'blocks'))) {
      console.warn('Collection "blocks" does not exist. Creating it...')

      const status = await qdrantClient?.createCollection('blocks', {
        vectors: {
          distance: 'Cosine',
          size: 1536,
          hnsw_config: {
            on_disk: true,
          }
        },
      });

      if (!status) {
        throw new Error('Failed to create blocks collection');
      }

      console.warn('Collection "blocks" created successfully');
    }
  })();
}

export default qdrantClient;
