import { Client } from '@elastic/elasticsearch';

if (!process.env.ELASTICSEARCH_URL) {
  throw new Error('ELASTICSEARCH_URL is not defined');
}

if (!process.env.ELASTICSEARCH_PASSWORD) {
  throw new Error('ELASTICSEARCH_PASSWORD is not defined');
}

if (!process.env.ELASTICSEARCH_USERNAME) {
  throw new Error('ELASTICSEARCH_USERNAME is not defined');
}

export default new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    password: process.env.ELASTICSEARCH_PASSWORD,
    username: process.env.ELASTICSEARCH_USERNAME,
  },
});
