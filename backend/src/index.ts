import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import routes from './routes/index';

// -=- Connect to MongoDB with dotenv file -=-
dotenv.config();
mongoose.connect(process.env.MONGO_URL ?? '');

// -=- Setup express -=-
const app = express();
const port = 8000;

// -=- Setup body & cookie parser parser -=-
app.use(bodyParser.json());
app.use(cookieParser());

// -=- Add CORS headers -=-
app.use(cors());

// -=- Add API Routes -=-
app.use('/', routes);

// -=- Start The Express Server -=-
app.listen(port);
