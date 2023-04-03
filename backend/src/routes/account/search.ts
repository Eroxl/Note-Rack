import express from 'express';
import { SessionRequest } from 'supertokens-node/framework/express';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import ElasticSearchClient from '../../helpers/search/ElasticSearchClient';

const router = express.Router();

router.get(
  '/search',
  verifySession(),
  async (req: SessionRequest, res) => {
    const username = req.session!.getUserId();
    const filter = req.query.filter;

    if (typeof filter !== 'string') {
      res.statusCode = 401;
      res.json({
        status: 'error',
        message: 'Please enter a search term!',
      });
      return;
    }

    // const results = await ElasticSearchClient.search({
    //   index: 'blocks',
    //   query: {
    //     bool: {
    //       must: {
    //         match: {
    //           content: filter,
    //         }
    //       },
    //       filter: {
    //         term: {
    //           userID: username,
    //         }
    //       }
    //     }
    //   },
    // });

    // console.log(JSON.stringify(
    //   results,
    //   null,
    //   2,
    // ))

    const results = await ElasticSearchClient.search({
      index: 'blocks',
      query: {
        bool: {
          must: {
            match: {
              content: filter,
            },
          },
          filter: {
            term: {
              userID: username,
            },
          },
        },
      },
      highlight: {
        fields: {
          content: {},
        },
        number_of_fragments: 1,
      }
    });

    res.statusCode = 200;
    res.json({
      status: 'success',
      message: results.hits.hits.map((hit) => {
        const sources = (hit?._source as Record<string, unknown>) ?? {};

        return ({
          content: (hit?.highlight?.content || [''])[0],
          blockID: sources?.blockId || '',
          pageID: sources?.pageId || '',
        })
      })
    });
  },
);

export default router;
