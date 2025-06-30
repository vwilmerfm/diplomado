import bcrypt from "bcryptjs";
import logger from "../logs/logger.js";
import config from "../config/env.js";

export const encriptar = async (pText) => {
    try {
        const salt = config.BCRYPT_SALT_ROUNDS;
        const hash = await bcrypt.hash(pText, salt);
        return hash;
    } catch (error) {
        logger.error(error);
        throw new Error('Error al encriptar la contraseña :(');
    }
};

export const comparar = async (pText, pHash) => {
    try {
        return await bcrypt.compare(pText, pHash);
    } catch (error) {
        logger.error(error);
        throw new Error('Error al comparar la contraseña :(');
    }
};