import { Router } from 'express';
import {
  getSportClasses,
  createSportClass,
  getSportClassById,
  updateSportClass,
  deleteSportClass,
  enrollToSportClass,
  rateSportClass,
} from '../../controllers/classes/classesController';
import {
  isAuthenticated,
  isAdmin,
} from '../../middlewares/auth/authMiddleware';

const router = Router();

router
  .route('/')
  .get(getSportClasses)
  .post(isAuthenticated, isAdmin, createSportClass);

router
  .route('/:id')
  .get(getSportClassById)
  .put(isAuthenticated, isAdmin, updateSportClass)
  .delete(isAuthenticated, isAdmin, deleteSportClass);

router.put('/enrollment/:id', isAuthenticated, enrollToSportClass);
router.put('/rating/:id', isAuthenticated, rateSportClass);

export default router;
