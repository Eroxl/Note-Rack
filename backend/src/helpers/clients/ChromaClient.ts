import { ChromaClient } from "chromadb"

if (!process.env.CHROMA_URL) {
  throw new Error('CHROMA_URL is not defined');
}

const chromaClient = new ChromaClient(process.env.CHROMA_URL);

(async () => {
  const collections = await chromaClient.listCollections();

  if (!collections.includes('blocks')) {
    await chromaClient.createCollection('blocks');
  }
})();

export default chromaClient;
