import { Configuration, OpenAIApi } from 'openai';

let OpenAIClient: OpenAIApi | undefined;

if (process.env.NEXT_PUBLIC_IS_CHAT_ENABLED !== 'false') {

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined');
  }

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  OpenAIClient = new OpenAIApi(configuration);
}

export default OpenAIClient;
