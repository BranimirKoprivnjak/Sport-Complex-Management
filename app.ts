import express, { Express } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middlewares/error/errorMiddleware';

dotenv.config();

mongoose
  .connect(
    process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/db'
  )
  .catch(error => console.error(error));

mongoose.connection.on('error', error => console.error(error));
mongoose.connection.on('disconnected', () =>
  console.error('Server disconnected from MongoDB')
);

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

routes(app);
app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ msg: '404! Not Found.' });
});

app.listen(port, () => {
  console.log(`Express running on port ${port}`);
});
