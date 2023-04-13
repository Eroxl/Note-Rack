import { ChromaClient } from "chromadb"

if (!process.env.CHROMA_URL) {
  throw new Error('CHROMA_URL is not defined');
}

const chromaClient = new ChromaClient(process.env.CHROMA_URL);

(async () => {
  const collections = await chromaClient.listCollections() as { name: string }[]

  if (!collections.find((collection) => collection.name === 'blocks')) {
    await chromaClient.createCollection('blocks');
  }
})();

export default chromaClient;
