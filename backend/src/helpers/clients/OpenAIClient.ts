import { Configuration, OpenAIApi } from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not defined');
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const OpenAIClient = new OpenAIApi(configuration);

export default OpenAIClient;

