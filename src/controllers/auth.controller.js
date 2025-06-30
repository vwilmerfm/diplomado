import {comparar} from "../common/bcrypt.js";
import {User} from "../models/user.js";
import jwt from 'jsonwebtoken';
import config from "../config/env.js";

async function login(req, res, next) {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({where: {username}});

        const isMatch = user ? await comparar(password, user.password) : false;

        if (!user || !isMatch) {
            return res.status(401).json({message: 'Credenciales invalidas :('});
        }

        const token = jwt.sign(
            {userId: user.id},
            config.JWT_SECRET,
            {expiresIn: config.JWT_EXPIRES_IN}
        );

        return res.json({token});
    } catch (error) {
        next(error);
    }
}

export {
    login
};
