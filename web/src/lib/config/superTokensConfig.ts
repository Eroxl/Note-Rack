import SessionReact from 'supertokens-auth-react/recipe/session';
import ThirdParty, {
  Github,
  Google,
} from 'supertokens-auth-react/recipe/thirdparty';
import Router from 'next/router';

const superTokensConfig = () => ({
  appInfo: {
    appName: 'Note Rack',
    apiDomain: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
    websiteDomain: process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:3000',
    apiBasePath: `${process.env.NEXT_PUBLIC_API_URL?.replace(/https?:\/\/.*?\//, '')}/auth` || '/auth',
    websiteBasePath: '/auth',
  },
  recipeList: [
    ThirdParty.init({
      signInAndUpFeature: {
        providers: [
          Google.init(),
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
