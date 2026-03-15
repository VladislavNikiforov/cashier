import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import accountsRouter from './routes/accounts.js';
import categoriesRouter from './routes/categories.js';
import transactionsRouter from './routes/transactions.js';
import exportRouter from './routes/export.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Temp auth middleware — attaches userId from header or session
app.use('/api', (req, res, next) => {
  req.userId = req.headers['x-user-id'] || 'demo-user';
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/accounts', accountsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/export', exportRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
