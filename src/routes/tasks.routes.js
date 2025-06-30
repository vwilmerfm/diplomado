import {Router} from 'express';
import {
    getTasks,
    getTask,
    createTask,
    updateTask,
    taskDone,
    deleteTask
} from '../controllers/tasks.controller.js';

const router = Router();

router
    .route('/')
    .get(getTasks)
    .post(createTask);

router
    .route('/:id')
    .get(getTask)
    .put(updateTask)
    .delete(deleteTask)
    .patch(taskDone);

export default router;