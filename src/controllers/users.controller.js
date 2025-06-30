import {User} from "../models/user.js";

import logger from '../logs/logger.js';
import {Task} from "../models/task.js";

async function getUsers(req, res, next) {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'password', 'status'],
            order: [['id', 'DESC']],
            where: {
                status: 'active',
            },
        });
        res.json(users);
    } catch (error) {
        logger.error(error.message);
        // res.status(500).json({message: error.message});
        next(error);
    }
}

async function createUser(req, res, next) {
    try {
        const {username, password} = req.body;

        const user = await User.create({
            username,
            password,
        });

        res.json(user);
    } catch (error) {
        // logger.error(error.message);
        // res.status(500).json({message: error.message});
        next(error);
    }
}

async function getUser(req, res, next) {
    const {id} = req.params;
    try {
        const user = await User.findOne({
            attributes: ['id', 'username', 'status'],
            where: {
                id,
            },
        });


        if (!user)
            return res.status(404).json({
                message: 'User not found',
            });

        return res.json(user);
    } catch (error) {
        next(error);
    }
}

async function updateUser(req, res, next) {
    const {id} = req.params;
    const {username, password} = req.body;

    try {
        if (!username && !password) {
            return res.status(400).json({
                message: 'Username or Password is required',
            });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        if (username) user.username = username;
        if (password) user.password = password;

        await user.save();

        return res.json({message: 'User updated successfully', user});
    } catch (error) {
        next(error);
    }
}

async function deleteUser(req, res, next) {
    const {id} = req.params;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        await User.destroy({where: {id}});

        return res.status(204).send();
    } catch (error) {
        if (!res.headersSent) {
            next(error);
        }
    }
}

async function activateInactivate(req, res, next) {
    const {id} = req.params;
    const {status} = req.body;
    try {

        if (!status) {
            return res.status(400).json({message: 'Status is required'});
        }

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        if (user.status === status) {
            return res.status(409).json({message: 'Conflict: same Status omg'});
        }

        user.status = status;
        await user.save();

        return res.json(user);
    } catch (error) {
        next(error);
    }
}

async function getTasks(req, res, next) {
    const {id} = req.params;
    try {
        if (isNaN(Number(id))) {
            return res.status(400).json({ message: 'ID invalido' });
        }

        const user = await User.findOne({
            attributes: ['username'],
            include: [
                {
                    model: Task,
                    attributes: ['name', 'done'],
                    where: {
                        done: false,
                    },
                }
            ],
            where: {
                id,
            },
        });

        if (!user)
            return res.status(404).json({
                message: 'User not found',
            });

        return res.json(user);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

// NUEVO METODO PARA LA INVESTIGACION

async function getUsersPagination(req, res, next) {
    try {
        // OBTENER LOS PARAMS DE QUERY CON VALORES POR DEFECTO

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const orderBy = req.query.orderBy || 'id';
        const orderDir = req.query.orderDir || 'DESC';

        // VALIDAR

        const validLimits = [5, 10, 15, 20];
        const actualLimit = validLimits.includes(limit) ? limit : 10;

        const validOrderBy = ['id', 'username', 'status'];
        const actualOrderBy = validOrderBy.includes(orderBy) ? orderBy : 'id';

        const validOrderDir = ['ASC', 'DESC'];
        const actualOrderDir = validOrderDir.includes(orderDir.toUpperCase()) ? orderDir.toUpperCase() : 'DESC';

        // CALCULA EL OFFSET

        const offset = (page - 1) * actualLimit;

        let whereCondition = {};
        if (search) {
            whereCondition = {
                username: {
                    [Op.like]: `%${search}%`
                }
            };
        }

        // REALIZAR CONSULTA CON PAGINACION

        const { count, rows } = await User.findAndCountAll({
            attributes: ['id', 'username', 'status'],
            where: whereCondition,
            order: [[actualOrderBy, actualOrderDir]],
            limit: actualLimit,
            offset: offset
        });

        const totalPages = Math.ceil(count / actualLimit);

        const response = {
            total: count,
            page: page,
            pages: totalPages,
            data: rows
        };

        res.json(response);

    } catch (error) {
        logger.error(error.message);
        next(error);
    }
}

export {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    activateInactivate,
    getTasks,
    getUsersPagination
};