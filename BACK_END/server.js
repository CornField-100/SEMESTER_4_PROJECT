// server.js
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 60*1000, max: 60 })); // basic rate limit

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
