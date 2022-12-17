import ThirdPartyEmailPasswordReact from 'supertokens-auth-react/recipe/thirdpartyemailpassword';
import SessionReact from 'supertokens-auth-react/recipe/session';
import Router from 'next/router';

const superTokensConfig = () => ({
  appInfo: {
    appName: 'Note Rack',
    apiDomain: 'http://127.0.0.1:8000',
    websiteDomain: 'http://127.0.0.1:3000',
    apiBasePath: '/auth',
    websiteBasePath: '/auth',
  },
  recipeList: [
    ThirdPartyEmailPasswordReact.init({
      signInAndUpFeature: {
        providers: [
          ThirdPartyEmailPasswordReact.Google.init(),
          ThirdPartyEmailPasswordReact.Github.init(),
          ThirdPartyEmailPasswordReact.Apple.init(),
        ],
      },
    }),
    SessionReact.init(),
  ],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  windowHandler: (oI: any) => ({
    ...oI,
    location: {
      ...oI.location,
      setHref: (href: string) => {
        Router.push(href);
      },
    },
  }),
});

export default superTokensConfig;
