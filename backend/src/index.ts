import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import verifyValidityOfToken from './auth';
import routes from './routes/index';

// -=- Connect to MongoDB with dotenv file -=-
dotenv.config();
mongoose.connect(process.env.MONGO_URL ?? '');

// -=- Setup express -=-
const app = express();
const port = 8000;

// -=- Add CORS headers -=-
app.use(cors({ origin: 'http://127.0.0.1:3000', credentials: true }));

// -=- Setup body & cookie parser & cors -=-
app.use(bodyParser.json());
app.use(cookieParser());

// -=- Setup jwt token authentication middleware -=-
app.use(verifyValidityOfToken);

// -=- Add API Routes -=-
app.use('/', routes);

// -=- Start The Express Server -=-
app.listen(port);
