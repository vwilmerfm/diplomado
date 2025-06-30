import {DataTypes} from "sequelize";
import {sequelize} from "../database/database.js";
import {Status} from "../constants/index.js";
import {Task} from "./task.js";
import {encriptar} from "../common/bcrypt.js";
import logger from "../logs/logger.js";

export const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true

    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "User name is required"
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Password is required"
            }
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: Status.ACTIVE,
        validate: {
            notNull: {
                msg: "Status is required"
            },
            isIn: {
                args: [[Status.ACTIVE, Status.INACTIVE]],
                msg: `Status must be ${Status.ACTIVE} or ${Status.INACTIVE}`
            }
        }
    },
});

User.hasMany(Task);

// User.hasMany(Task, {
//     foreignKey: 'userId',
//     sourceKey: 'id'
// });

Task.belongsTo(User);

// Task.belongsTo(User, {
//     foreignKey: 'userId',
//     sourceKey: 'id'
// });

async function encriptarPassword(user) {
    try {
        user.password = await encriptar(user.password);
    } catch (error) {
        logger.error(error);
        throw new Error('Error al encriptar la contraseña :(');
    }
}

User.beforeCreate(encriptarPassword);
User.beforeUpdate(encriptarPassword);

// User.beforeCreate(async (user) => {
//     try {
//         user.password = await encriptar(user.password);
//     } catch (error) {
//         logger.error(error);
//         throw new Error('Error al encriptar la contraseña, antes de crear el usuario :(');
//     }
// });
//
// User.beforeUpdate(async (user) => {
//     try {
//         user.password = await encriptar(user.password);
//     } catch (error) {
//         logger.error(error);
//         throw new Error('Error al encriptar la contraseña, antes de crear el usuario :(');
//     }
// });