import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser';
// Library that we use to access mongoDB 
// and work with data inside it.
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser  } from '@mm-ticketing-app/common';
import { createOrderRouter } from './routes/new-order';
import { showOrderRouter } from './routes/show-order';
import { showAllOrdersRouter } from './routes/show-all-orders';
import { deleteOrderRouter } from './routes/delete-order';

const app = express();
app.set('trust proxy', true); // Allow traffic though ingress-nginx
app.use(json());
app.use(
  cookieSession({
    signed: false, // disable cookie encryption
    secure: process.env.NODE_ENV !== 'test'
    // allow visiting from http:// and test environment
  })
);

app.use(currentUser);

app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(showAllOrdersRouter);
app.use(deleteOrderRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app }