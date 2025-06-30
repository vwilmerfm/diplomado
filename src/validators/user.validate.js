import Joi from "joi";

export const createUserSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .alphanum()
        .regex(/[0-9a-zA-Z]*\d[0-9a-zA-Z]*/)
        // .min(4)
        .required(),
});