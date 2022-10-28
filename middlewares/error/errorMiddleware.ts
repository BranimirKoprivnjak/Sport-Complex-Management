import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).json({ msg: 'Invalid id.' });
  }

  // if (error.name === 'MongoServerError' && error.code === 11000) {
  //   return res.status(400).json({ msg: 'Email already in use.' });
  // }

  console.error(error);
  return res.status(500).json({ msg: 'Server Error.' });
};
