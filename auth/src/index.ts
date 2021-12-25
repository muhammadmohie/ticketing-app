import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log('Starting up...')
  if (!process.env.JWT_KEY) {
    throw new Error('No jwt key');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to MongoDb');
    } catch (err) {
      console.error(err);
    }
  
    app.listen(3000, () => {
      console.log('Auth is Listening on port 3000!');
    });
};

start();