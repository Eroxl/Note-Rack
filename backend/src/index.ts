import { middleware, errorHandler } from 'supertokens-node/framework/express';
import supertokens from 'supertokens-node';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import setupAuth from './setupAuth';

// -=- Connect to MongoDB with dotenv file -=-
dotenv.config();
mongoose.connect(
  process.env.MONGO_URL ?? '',
).catch((err) => {
  console.log(err);
});

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

import routes from './routes/index';

// -=- Add API Routes -=-
app.use('/', routes);

// -=- Setup Super Tokens Error Handling -=-
app.use(errorHandler());

console.log(`Server running on port ${port}`);

// -=- Start The Express Server -=-
app.listen(port);
