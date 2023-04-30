import { Client } from '@elastic/elasticsearch';

if (!process.env.ELASTICSEARCH_URL && !process.env.ELASTICSEARCH_CLOUD_ID) {
  throw new Error('ELASTICSEARCH_URL is not defined or ELASTICSEARCH_CLOUD_ID is not defined');
}

if (!process.env.ELASTICSEARCH_PASSWORD) {
  throw new Error('ELASTICSEARCH_PASSWORD is not defined');
}

if (!process.env.ELASTICSEARCH_USERNAME) {
  throw new Error('ELASTICSEARCH_USERNAME is not defined');
}

const URLConnection = process.env.ELASTICSEARCH_URL !== undefined
  ? {
    node: process.env.ELASTICSEARCH_URL as string,
  }
  : {
    cloud: {
      id: process.env.ELASTICSEARCH_CLOUD_ID as string,
    }
  }

const client = new Client({
  ...URLConnection,
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