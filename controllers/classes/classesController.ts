import { NextFunction, RequestHandler, Response } from 'express';
import SportClass from '../../models/SportClass';
import User from '../../models/User';
import { RequestWithUser } from '../../types/types';
import { getAverageRating } from '../helpers';

export const getSportClasses: RequestHandler = async (req, res, next) => {
  try {
    const sportClasses = await SportClass.find({});

    const filters = req.query;
    const filteredSportClasses = sportClasses.filter(sportClass => {
      let isValid = true; // sport class has to satisfy every filter from url
      for (const key in filters) {
        const filterAsString = filters[key] as string;
        const filter = filterAsString.split(',');
        isValid = isValid && filter.includes(sportClass[key]);
      }
      return isValid;
    });

    return res.status(200).json(filteredSportClasses);
  } catch (error) {
    next(error);
  }
};

export const createSportClass: RequestHandler = async (req, res, next) => {
  if (!req.body.name || !req.body.description) {
    return res
      .status(400)
      .json({ msg: 'Class name or/and description missing.' });
  }

  try {
    await SportClass.create(req.body);

    res.status(200).json({ msg: 'Sport class successfully added.' });
  } catch (error) {
    next(error);
  }
};

export const getSportClassById: RequestHandler = async (req, res, next) => {
  try {
    const sportClass = await SportClass.findById(req.params.id);

    if (!sportClass) return res.status(400).json({ msg: 'Invalid id.' });

    return res.status(200).json(sportClass);
  } catch (error) {
    next(error);
  }
};

export const updateSportClass: RequestHandler = async (req, res, next) => {
  const { params, body } = req;
  console.log(body);

  try {
    const sportClass = await SportClass.findByIdAndUpdate(params.id, body);

    if (!sportClass) return res.status(400).json({ msg: 'Invalid id.' });

    return res.status(200).json({ msg: 'Sport class successfully updated.' });
  } catch (error) {
    next(error);
  }
};

export const deleteSportClass: RequestHandler = async (req, res, next) => {
  try {
    const sportClass = await SportClass.findByIdAndDelete(req.params.id);

    if (!sportClass) return res.status(400).json({ msg: 'Invalid id.' });

    return res.status(200).json({ msg: 'Sport class successfully deleted.' });
  } catch (error) {
    next(error);
  }
};

export const enrollToSportClass = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const sportClassId = req.params.id;

  try {
    const user = await User.findById(userId);
    const sportClass = await SportClass.findById(sportClassId);

    if (!sportClass || !user) {
      return res.status(400).json({ msg: 'Invalid id.' });
    }

    // unenroll
    if (user.enrolledClasses.includes(sportClassId)) {
      const indexOfUser = user.enrolledClasses.indexOf(sportClassId);
      user.enrolledClasses.splice(indexOfUser, 1);
      user.save();

      const indexOfSportClass = sportClass.enrolledUsers.indexOf(userId);
      sportClass.enrolledUsers.splice(indexOfSportClass, 1);
      sportClass.save();

      return res.status(200).json({ msg: 'User successfully removed.' });
    }

    // enroll
    if (
      user.enrolledClasses.length < 2 &&
      sportClass.enrolledUsers.length < 10
    ) {
      sportClass.enrolledUsers.push(userId);
      sportClass.save();

      user.enrolledClasses.push(sportClassId);
      user.save();

      return res.status(200).json({ msg: 'User successfully added.' });
    }
  } catch (error) {
    next(error);
  }
};

export const rateSportClass = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const sportClassId = req.params.id;

  if (!req.body.comment || !req.body.rating) {
    return res.status(400).json({ msg: 'Comment or/and rating missing.' });
  }

  try {
    const sportClass = await SportClass.findById(sportClassId);

    if (!sportClass) return res.status(400).json({ msg: 'Invalid id.' });

    const { reviews, averageRating } = sportClass;

    if (reviews.some(review => review.userId === userId)) {
      return res.status(400).json({ msg: 'User already rated this class.' });
    }

    sportClass.reviews.push({
      userId,
      ...req.body,
    });

    sportClass.averageRating =
      averageRating === 0 ? req.body.rating : getAverageRating(reviews);

    sportClass.save();
    return res.status(200).json({ msg: 'Sport class successfully reviewed.' });
  } catch (error) {
    next(error);
  }
};
