import bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { middleware, errorHandler } from 'supertokens-node/framework/express';
import supertokens from 'supertokens-node';

import setupAuth from './setupAuth';
import routes from './routes/index';

// -=- Connect to MongoDB with dotenv file -=-
dotenv.config();
mongoose.connect(process.env.MONGO_URL ?? '');

// -=- Setup express -=-
const app = express();
const port = 8000;

// -=- Setup Super Tokens -=-
setupAuth();

// -=- Setup body parser -=-
app.use(bodyParser.json());

// -=- URL Info -=-
const {
  WEBSITE_DOMAIN,
} = process.env;

// -=- Check URL Info Exists -=-
if (!WEBSITE_DOMAIN) throw Error('Missing Website Domain');

// -=- Add CORS headers -=-
app.use(cors({
  origin: WEBSITE_DOMAIN,
  allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
  methods: ['GET', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// -=- Add Super Tokens Middleware -=-
app.use(middleware());

// -=- Add API Routes -=-
app.use('/', routes);

// -=- Setup Swagger -=-
app.use(
  '/docs',
  swaggerUI.serve,
  swaggerUI.setup(
    swaggerJSDoc({
      swaggerDefinition: {
        info: {
          title: 'REST API for my App',
          version: '1.0.0',
          description: 'This is the REST API for Note Rack',
        },
        host: '127.0.0.1:8000',
        basePath: '/docs/',
      },
      apis: ['./documentation/**/*.yaml'],
    }),
    {
      customSiteTitle: 'Note Rack REST API',
    },
  ),
);

// -=- Setup Super Tokens Error Handling -=-
app.use(errorHandler());

// -=- Start The Express Server -=-
app.listen(port);
