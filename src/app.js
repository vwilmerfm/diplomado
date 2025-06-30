import express from 'express';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import taskRoutes from './routes/tasks.routes.js';
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler.js";
import notFound from "./middlewares/notFound.js";
import {authenticateToken} from "./middlewares/authenticate.js";
//
const app = express();

// Uso de Middlewares
app.use(morgan('dev'));
app.use(express.json());


// Uso de las rutas
app.use('/api/login', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes);

// Middleware para rutas no encontradas (404)
app.use(notFound);

app.use(errorHandler);

export default app;