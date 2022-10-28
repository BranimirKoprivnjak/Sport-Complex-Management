import { Express } from 'express';
import authRouter from './auth/authRouter';
import sportClassRouter from './classes/classesRouter';
import usersRouter from './users/usersRouter';

const routes = (server: Express) => {
  server.use('/auth', authRouter);
  server.use('/classes', sportClassRouter);
  server.use('/users', usersRouter);
};

export default routes;
