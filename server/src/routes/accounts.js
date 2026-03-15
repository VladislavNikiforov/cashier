import { Router } from 'express';
import { db } from '../db/index.js';
import { accounts } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

const router = Router();

// GET /api/accounts
router.get('/', async (req, res) => {
  try {
    const result = await db.select().from(accounts)
      .where(eq(accounts.userId, req.userId))
      .orderBy(accounts.sortOrder);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/accounts
router.post('/', async (req, res) => {
  try {
    const { name, type, currency, icon, color } = req.body;
    const [account] = await db.insert(accounts).values({
      userId: req.userId,
      name, type, currency, icon, color,
    }).returning();
    res.status(201).json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/accounts/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, type, currency, icon, color, sortOrder } = req.body;
    const [account] = await db.update(accounts)
      .set({ name, type, currency, icon, color, sortOrder })
      .where(and(eq(accounts.id, req.params.id), eq(accounts.userId, req.userId)))
      .returning();
    if (!account) return res.status(404).json({ error: 'Not found' });
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/accounts/:id
router.delete('/:id', async (req, res) => {
  try {
    const [deleted] = await db.delete(accounts)
      .where(and(eq(accounts.id, req.params.id), eq(accounts.userId, req.userId)))
      .returning();
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
