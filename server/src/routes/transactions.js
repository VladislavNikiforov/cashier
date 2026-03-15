import { Router } from 'express';
import { db } from '../db/index.js';
import { transactions, accounts, categories } from '../db/schema.js';
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';

const router = Router();

// GET /api/transactions?from=2026-03-01&to=2026-03-31
router.get('/', async (req, res) => {
  try {
    const { from, to } = req.query;
    const conditions = [eq(transactions.userId, req.userId)];
    if (from) conditions.push(gte(transactions.date, new Date(from)));
    if (to) conditions.push(lte(transactions.date, new Date(to + 'T23:59:59')));

    const result = await db.select({
      id: transactions.id,
      type: transactions.type,
      amount: transactions.amount,
      currency: transactions.currency,
      note: transactions.note,
      date: transactions.date,
      accountId: transactions.accountId,
      categoryId: transactions.categoryId,
      accountName: accounts.name,
      categoryName: categories.name,
      categoryIcon: categories.icon,
      categoryColor: categories.color,
    })
      .from(transactions)
      .leftJoin(accounts, eq(transactions.accountId, accounts.id))
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(and(...conditions))
      .orderBy(desc(transactions.date));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/transactions/summary?from=...&to=...
router.get('/summary', async (req, res) => {
  try {
    const { from, to } = req.query;
    const conditions = [eq(transactions.userId, req.userId)];
    if (from) conditions.push(gte(transactions.date, new Date(from)));
    if (to) conditions.push(lte(transactions.date, new Date(to + 'T23:59:59')));

    const result = await db.select({
      categoryId: transactions.categoryId,
      categoryName: categories.name,
      categoryIcon: categories.icon,
      categoryColor: categories.color,
      type: transactions.type,
      total: sql`sum(${transactions.amount})`.as('total'),
    })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(and(...conditions))
      .groupBy(transactions.categoryId, categories.name, categories.icon, categories.color, transactions.type);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/transactions
router.post('/', async (req, res) => {
  try {
    const { accountId, categoryId, type, amount, currency, note, date } = req.body;
    const [tx] = await db.insert(transactions).values({
      userId: req.userId,
      accountId, categoryId, type,
      amount, currency, note,
      date: new Date(date),
    }).returning();

    // Update account balance
    const sign = type === 'income' ? 1 : -1;
    await db.update(accounts)
      .set({ balance: sql`${accounts.balance} + ${sign * parseFloat(amount)}` })
      .where(eq(accounts.id, accountId));

    res.status(201).json(tx);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', async (req, res) => {
  try {
    const [deleted] = await db.delete(transactions)
      .where(and(eq(transactions.id, req.params.id), eq(transactions.userId, req.userId)))
      .returning();
    if (!deleted) return res.status(404).json({ error: 'Not found' });

    // Reverse balance
    const sign = deleted.type === 'income' ? -1 : 1;
    await db.update(accounts)
      .set({ balance: sql`${accounts.balance} + ${sign * parseFloat(deleted.amount)}` })
      .where(eq(accounts.id, deleted.accountId));

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
