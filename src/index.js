import "dotenv/config";
import app from './app.js';
import logger from "./logs/logger.js";
import config from "./config/env.js";
import {sequelize} from "./database/database.js";

async function main() {
    await sequelize.authenticate()
        .then(() => console.log("Conexion verificada :)"))
        .catch(err => console.error("Error de conexion: ", err));

    // await sequelize.sync({force: true});

    await sequelize.sync()
        .then(() => {
            console.log("Tablas creadas :)");
        })
        .catch(error => {
            console.error("Error al crear tablas: ", error);
        });

    app.listen(config.PORT, () => {
        logger.info(`Server is running on port 3000 :) on Pino`);
        logger.error(`Server is running on port 3000 :) on Pino`);
        logger.warn(`Server is running on port 3000 :) on Pino`);
        logger.fatal(`Server is running on port 3000 :) on Pino`);
    });

}

main().then(() => console.log(`Everything is running :)`));