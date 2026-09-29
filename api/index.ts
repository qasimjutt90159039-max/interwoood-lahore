import express from 'express';
import cors from 'cors';
import apiRoutes from '../backend/routes/api.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle both /api and root paths for Vercel serverless functions
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    brand: 'Interwood Lahore',
    time: new Date().toISOString()
  });
});

export default app;
