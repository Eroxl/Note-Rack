import { Configuration, CollectionsApiFp, PointsApiFp } from "./QDrantBindings";

type ReturnValues<T> = T extends (...args: any[]) => infer R ? R : never;

type QDrantClient = ReturnValues<typeof CollectionsApiFp> & ReturnValues<typeof PointsApiFp>;
let qdrantClient: QDrantClient | undefined;

if (process.env.NEXT_PUBLIC_IS_CHAT_ENABLED !== 'false') {

  if (!process.env.QDRANT_URL) {
    throw new Error('QDRANT_URL is not defined');
  }

  const config = new Configuration({
    basePath: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  });

  qdrantClient = {
    ...CollectionsApiFp(config),
    ...PointsApiFp(config),
  };

  (async () => {
    const collections = await (await qdrantClient?.getCollections())()

    if (!(collections?.data.result?.collections.find((collection) => collection.name === 'blocks'))) {
      qdrantClient?.createCollection('blocks', undefined, {
        vectors: {
          distance: 'Cosine',
          size: 1536,
        },
        on_disk_payload: true,
      });
    }
  })();
}

export default qdrantClient;
