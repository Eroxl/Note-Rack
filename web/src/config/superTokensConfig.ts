import SessionReact from 'supertokens-auth-react/recipe/session';
import ThirdParty, {
  Github,
  Google,
  Apple,
} from 'supertokens-auth-react/recipe/thirdparty';
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
    ThirdParty.init({
      signInAndUpFeature: {
        providers: [
          Github.init(),
          Google.init(),
          Apple.init(),
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
