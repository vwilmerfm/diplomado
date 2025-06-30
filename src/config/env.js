const requiredEnv = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error('Missing environment variable: ' + key);
    }
    return value;
};

const config = {
    PORT: requiredEnv("PORT"),
    DB_DATABASE_NAME: requiredEnv("DB_DATABASE_NAME"),
    DB_USER: requiredEnv("DB_USER"),
    DB_PASSWORD: requiredEnv("DB_PASSWORD"),
    DB_HOST: requiredEnv("DB_HOST"),
    DB_DIALECT: requiredEnv("DB_DIALECT"),
    BCRYPT_SALT_ROUNDS: Number(requiredEnv("BCRYPT_SALT_ROUNDS")),
    JWT_SECRET: requiredEnv("JWT_SECRET"),
    JWT_EXPIRES_IN: requiredEnv("JWT_EXPIRES_IN"),
    DB_USE_SSL: requiredEnv("DB_USE_SSL")
};

export default config;