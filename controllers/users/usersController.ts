import { Request, RequestHandler, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../../models/User';

export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await User.find({});

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const createNewUser: RequestHandler = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ msg: 'Email or/and password missing.' });
    }

    const user = new User(req.body);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    await user.save();

    return res.status(200).json({ msg: 'User successfully created.' });
  } catch (error) {
    next(error);
  }
};

export const getUserById: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(400).json({ msg: 'Invalid id.' });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);

    if (!user) return res.status(400).json({ msg: 'Invalid id.' });

    return res.status(200).json({ msg: 'User successfully updated.' });
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return res.status(400).json({ msg: 'Invalid id.' });

    return res.status(200).json({ msg: 'User successfully deleted.' });
  } catch (error) {
    next(error);
  }
};
