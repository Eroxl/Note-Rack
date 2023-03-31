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

const client = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    password: process.env.ELASTICSEARCH_PASSWORD,
    username: process.env.ELASTICSEARCH_USERNAME,
  },
});

client.indices.exists({
  index: 'blocks',
})
  .then((exists) => {
    if (exists) return;

    return client.indices.create({
      index: 'blocks',
    });
  })
  .then(() => {
    return client.indices.putMapping({
      index: 'blocks',
      body: {
        properties: {
          blockId: {
            type: 'keyword',
          },
          content: {
            type: 'text',
          },
          pageId: {
            type: 'keyword',
          },
          userID: {
            type: 'keyword',
          },
        },
      },
    });
  })
  .catch((err) => {
    if (err?.meta?.body?.error?.type !== 'resource_already_exists_exception') {
      console.error(err);
    }
  });

export default client;