/* eslint-disable no-underscore-dangle */
import ThirdPartyEmailPassword, { Google, Github, Apple } from 'supertokens-node/recipe/thirdpartyemailpassword';
import Session from 'supertokens-node/recipe/session';
import SuperTokens from 'supertokens-node';

import PageModel from './models/pageModel';
import UserModel from './models/userModel';
import PageMapModel from './models/pageMap';
import PageTreeModel from './models/pageTreeModel';

const setupAuth = () => {
  SuperTokens.init({
    framework: 'express',
    supertokens: {
      connectionURI: 'http://supertokens:3567',
    },
    appInfo: {
      apiDomain: '127.0.0.1:8000',
      appName: 'Note Rack',
      websiteDomain: 'http://127.0.0.1:3000',
      apiBasePath: '/auth',
      websiteBasePath: '/auth',
    },
    recipeList: [
      ThirdPartyEmailPassword.init({
        providers: [
          // TODO: Replace them with OAuth keys for production use.
          Google({
            clientId: '1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com',
            clientSecret: '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',
          }),
          Github({
            clientId: '467101b197249757c71f',
            clientSecret: 'e97051221f4b6426e8fe8d51486396703012f5bd',
          }),
          Apple({
            clientId: '4398792-io.supertokens.example.service',
            clientSecret: {
              keyId: '7M48Y4RYDL',
              privateKey:
                '-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----',
              teamId: 'YWQCXGJRJL',
            },
          }),
        ],
        override: {
          apis: (originalImplementation) => ({
            ...originalImplementation,
            signInUpPOST: async (input: any) => {
              // -=- Verify Original Implementation -=-
              if (originalImplementation.thirdPartySignInUpPOST === undefined) throw Error('Should never come here');

              // -=- Run Original Implementation -=-
              const response = await originalImplementation.thirdPartySignInUpPOST(input);

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
                      style: {},
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
