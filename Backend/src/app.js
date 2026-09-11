
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
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/welcome.css', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'style.css'));
});

app.get('/welcome.js', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'script.js'));
});

app.use('/analyze', algoRoutes);
app.use('/auth', authRoutes);

// Global error handler 
app.use(errorHandler);

export default app;
