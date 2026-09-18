import serverless from 'serverless-http';
import app from '../../server.js';
import { connectDB } from '../../config/db.js';

const expressHandler = serverless(app);

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectDB();
  return expressHandler(event, context);
};
