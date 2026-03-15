import { Router } from 'express';
import { db } from '../db/index.js';
import { categories } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

const router = Router();

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const result = await db.select().from(categories)
      .where(eq(categories.userId, req.userId))
      .orderBy(categories.sortOrder);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/categories
router.post('/', async (req, res) => {
  try {
    const { name, type, icon, color } = req.body;
    const [category] = await db.insert(categories).values({
      userId: req.userId,
      name, type, icon, color,
    }).returning();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/categories/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, type, icon, color, sortOrder } = req.body;
    const [category] = await db.update(categories)
      .set({ name, type, icon, color, sortOrder })
      .where(and(eq(categories.id, req.params.id), eq(categories.userId, req.userId)))
      .returning();
    if (!category) return res.status(404).json({ error: 'Not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', async (req, res) => {
  try {
    const [deleted] = await db.delete(categories)
      .where(and(eq(categories.id, req.params.id), eq(categories.userId, req.userId)))
      .returning();
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
