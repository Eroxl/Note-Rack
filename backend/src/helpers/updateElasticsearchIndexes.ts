import ElasticSearchClient from './clients/ElasticSearchClient';

// NOTE:EROXL:(2022-03-29) - I swear I'll come back and refactor all of this later
const updateElasticsearchIndexes = async (operations: any, page: string, pageOwner: string) => {
  const elasticSearchOps = operations.flatMap((operation: Record<string, any>) => {
    if (operation.type === 'addBlock') {
      const { data } = operation as {
        data: {
          'new-block-id': string,
          'new-block-properties': {
            value: string,
          },
        },
      }

      const blockId = data['new-block-id'];

      return [
        {
          create: {
            _index: 'blocks',
            _id: `${page}.${blockId}`,
          }
        },
        {
          userID: pageOwner,
          blockId: blockId,
          pageId: page,
          content: data['new-block-properties']?.value || '',
        }
      ]
    } else if (operation.type === 'editBlock') {
      const { data } = operation as {
        data: {
          'doc-ids': string[],
          'block-properties': {
            value?: string,
          },
        },
      }

      const blockId = data['doc-ids'][data['doc-ids'].length - 1];

      if (!data['block-properties']?.value) return [];

      return [
        {
          update: {
            _index: 'blocks',
            _id: `${page}.${blockId}`,
          }
        },
        {
          doc: {
            content: data['block-properties']?.value,
          }
        }
      ];
    } else if (operation.type === 'deleteBlock') {
      const { data } = operation as {
        data: {
          'doc-ids': string[],
        },
      }

      const blockId = data['doc-ids'][data['doc-ids'].length - 1];
      
      return [
        {
          delete: {
            _index: 'blocks',
            _id: `${page}.${blockId}`,
          }
        }
      ];
    }
  });

  try {
    await ElasticSearchClient.bulk({
      operations: elasticSearchOps,
    });
  } catch (err) {
    console.error(err);
  }
};

export default updateElasticsearchIndexes;
