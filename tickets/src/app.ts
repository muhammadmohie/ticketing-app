import express from "express";
import 'express-async-errors'
import { json } from "body-parser";
// Library that we use to access mongoDB 
// and work with data inside it.
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser  } from '@mm-ticketing-app/common';
import { createTicketRouter } from './routes/new-ticket';
import { showTicketRouter } from "./routes/show-ticket";
import { showAllTicketRouter } from "./routes/show-all-tickets";
import { updateTicketRouter } from "./routes/update-ticket";


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

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(showAllTicketRouter);
app.use(updateTicketRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app }