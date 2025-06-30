import {Router} from 'express';
import {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    activateInactivate,
    getTasks,
    getUsersPagination
} from '../controllers/users.controller.js';
import validate from "../validators/validate.js";
import {createUserSchema} from "../validators/user.validate.js";
import {authenticateToken} from "../middlewares/authenticate.js";

const router = Router();

router
    .route('/')
    .get(getUsers)
    .post(validate(createUserSchema, 'body'), createUser);

// RUTA PARA PAGINACION PARA LA INVESTIGACION

router.get('/list/pagination', getUsersPagination);

router
    .route('/:id')
    .get(authenticateToken, getUser)
    .put(authenticateToken, updateUser)
    .delete(authenticateToken, deleteUser)
    .patch(authenticateToken, activateInactivate);

router.get('/:id/tasks', authenticateToken, getTasks);

export default router;
