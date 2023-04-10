import { createClient } from 'redis';

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not defined');
}

const client = createClient({
  url: process.env.REDIS_URL,
});

client.connect().catch((err) => {
  console.error(`Redis connection error: ${err}`);
});

export default client;
