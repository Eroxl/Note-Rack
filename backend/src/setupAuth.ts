/* eslint-disable no-underscore-dangle */
import ThirdParty, { Github, Google } from 'supertokens-node/recipe/thirdparty';
import Session from 'supertokens-node/recipe/session';
import SuperTokens from 'supertokens-node';

import PageModel from './models/pageModel';
import UserModel from './models/userModel';
import PageMapModel from './models/pageMap';
import PageTreeModel from './models/pageTreeModel';

const setupAuth = () => {
  // -=- Add OAuth Keys -=-
  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
  } = process.env;

  const {
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
  } = process.env;

  // -=- Check OAuth Keys Exist -=-
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) throw Error('Missing Google OAuth Keys');
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) throw Error('Missing Github OAuth Keys');

  // -=- URL Info -=-
  const {
    API_DOMAIN,
    WEBSITE_DOMAIN,
    SUPERTOKENS_URL,
  } = process.env;

  // -=- Check URL Info Exists -=-
  if (!API_DOMAIN) throw Error('Missing API Domain');
  if (!WEBSITE_DOMAIN) throw Error('Missing Website Domain');
  if (!SUPERTOKENS_URL) throw Error('Missing Supertokens Connection URI');

  // -=- Setup SuperTokens -=-
  SuperTokens.init({
    framework: 'express',
    supertokens: {
      connectionURI: SUPERTOKENS_URL,
      apiKey: process.env.SUPERTOKENS_API_KEY,
    },
    appInfo: {
      apiDomain: API_DOMAIN,
      appName: 'Note Rack',
      websiteDomain: WEBSITE_DOMAIN,
      apiBasePath: '/auth',
      websiteBasePath: '/auth',
    },
    recipeList: [
      ThirdParty.init({
        signInAndUpFeature: {
          providers: [
            Google({
              clientId: GOOGLE_CLIENT_ID,
              clientSecret: GOOGLE_CLIENT_SECRET,
            }),
            Github({
              clientId: GITHUB_CLIENT_ID,
              clientSecret: GITHUB_CLIENT_SECRET,
            }),
          ],
        },
        override: {
          apis: (originalImplementation) => ({
            ...originalImplementation,
            signInUpPOST: async (input: any) => {
              // -=- Verify Original Implementation -=-
              if (originalImplementation.signInUpPOST === undefined) throw Error('Should never come here');

              // -=- Run Original Implementation -=-
              const response = await originalImplementation.signInUpPOST(input);

              // -=- Check Response Status -=-
              if (response.status !== 'OK') return response;

              // -=- Check Response Type -=-
              if (!response.createdNewUser) return response;

              const userID = response.user.id;

              // -=- Post Sign Up Code -=-

              // ~ Create the users homepage
              const homePage = await PageModel.create(
                {
                  user: userID,
                  style: {
                    colour: {
                      r: 147,
                      g: 197,
                      b: 253,
                    },
                    icon: '📝',
                    name: 'New Notebook',
                  },
                  permissions: {},
                  data: [],
                },
              );

              // ~ Create the users page tree
              await PageTreeModel.create(
                {
                  _id: userID,
                  subPages: [
                    {
                      _id: homePage._id,
                      expanded: false,
                      style: {
                        colour: {
                          r: 147,
                          g: 197,
                          b: 253,
                        },
                        icon: '📝',
                        name: 'New Notebook',
                      },
                      subPages: [],
                    },
                  ],
                },
              );

              // ~ Create the map to the homepage
              await PageMapModel.create({
                _id: homePage._id,
                pathToPage: [],
              });

              // ~ Create a new user model on our DB with the same userID
              await UserModel.create({
                username: userID,
                homePage: homePage._id,
              });

              return response;
            },
          }),
        },
      }),
      Session.init(),
    ],
  });
};

export default setupAuth;
