import {Task} from "../models/task.js";

async function getTasks(req, res, next) {
    const {userId} = req.user;
    try {
        const tasks = await Task.findAll({
            attributes: ['id', 'name', 'done'],
            order: [['name', 'ASC']],
            where: {
                userId,
            },
        });
        return res.json(tasks);
    } catch (error) {
        next(error);
    }
}

async function getTask(req, res, next) {
    const {id} = req.params;
    const {userId} = req.user;
    try {
        const task = await Task.findOne({
            attributes: ['name', 'done'],
            where: {
                id,
                userId,
            },
        });

        if (!task)
            return res.status(404).json({
                message: 'Task not found',
            });

        return res.json(task);
    } catch (error) {
        next(error);
    }
}

async function createTask(req, res, next) {
    const {userId} = req.user;
    console.log("ssdsds", userId);
    const {name} = req.body;
    try {
        const task = await Task.create({
            name,
            userId,
        });

        return res.json(task);
    } catch (error) {
        next(error);
    }
}

async function updateTask(req, res, next) {
    const {userId} = req.user;
    const {id} = req.params;
    const {name} = req.body;

    try {
        const task = await Task.update({
                name,
            },
            {
                where: {
                    id,
                    userId,
                },
            });

        if (task[0] === 0) {
            return res.status(404).json({
                message: 'Task not found',
            });
        }

        return res.json(task);
    } catch (error) {
        next(error);
    }
}

async function taskDone(req, res, next) {
    const {userId} = req.user;
    const {id} = req.params;
    const {done} = req.body;

    try {
        const task = await Task.update({
                done,
            },
            {
                where: {
                    id,
                    userId,
                },
            });

        if (task[0] === 0) {
            return res.status(404).json({
                message: 'Task not found',
            });
        }

        return res.json(task);
    } catch (error) {
        next(error);
    }
}

async function deleteTask(req, res, next) {
    const {id} = req.params;
    const {userId} = req.user;

    try {
        const task = await Task.findByPk(id);

        if (!task) {
            return res.status(404).json({message: 'Task not found'});
        }

        await Task.destroy({where: {id, userId}});

        return res.status(204).send();
    } catch (error) {
        if (!res.headersSent) {
            next(error);
        }
    }
}

export {
    getTasks,
    getTask,
    createTask,
    updateTask,
    taskDone,
    deleteTask
};