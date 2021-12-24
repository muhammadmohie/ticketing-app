import express from "express";
import 'express-async-errors'
import { json } from "body-parser";
// Library that we use to access mongoDB 
// and work with data inside it.
import cookieSession from "cookie-session";


import { currentUserRouter } from './routes/current-user';
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler, NotFoundError } from '@mm-ticketing-app/common';

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


app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app }