import { Router } from 'express';
import {
  getUsers,
  createNewUser,
  getUserById,
  updateUser,
  deleteUser,
} from '../../controllers/users/usersController';
import {
  isAuthenticated,
  isAdmin,
} from '../../middlewares/auth/authMiddleware';

const router = Router();

router
  .route('/')
  .get(isAuthenticated, isAdmin, getUsers)
  .post(isAuthenticated, isAdmin, createNewUser);

router
  .route('/:id')
  .get(isAuthenticated, isAdmin, getUserById)
  .put(isAuthenticated, isAdmin, updateUser)
  .delete(isAuthenticated, isAdmin, deleteUser);

export default router;
