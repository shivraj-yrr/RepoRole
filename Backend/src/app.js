
import './config/env.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import algoRoutes from './routes/analyze.routes.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

app.set('trust proxy', 1);
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('welcome to the backend API of REPOROLE');
});

app.use('/analyze', algoRoutes);
app.use('/auth', authRoutes);

// Global error handler 
app.use(errorHandler);

export default app;
