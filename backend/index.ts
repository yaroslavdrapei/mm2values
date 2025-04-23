import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import { itemRouter } from './routes/item-router';
import { subscriberRouter } from './routes/subscriber-router';

mongoose.connect(process.env.MONGO_URI!);

const PORT = 5500;
const app = express();

app.use(express.json());
app.use('/items', itemRouter);
app.use('/subscribers', subscriberRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
