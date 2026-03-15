import { Router } from 'express';
import { db } from '../db/index.js';
import { transactions, accounts, categories } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import * as XLSX from 'xlsx';

const router = Router();

// GET /api/export/excel
router.get('/excel', async (req, res) => {
  try {
    const rows = await db.select({
      date: transactions.date,
      type: transactions.type,
      account: accounts.name,
      category: categories.name,
      amount: transactions.amount,
      currency: transactions.currency,
      note: transactions.note,
    })
      .from(transactions)
      .leftJoin(accounts, eq(transactions.accountId, accounts.id))
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(eq(transactions.userId, req.userId))
      .orderBy(desc(transactions.date));

    const data = rows.map(r => ({
      'Date': r.date,
      'Type': r.type,
      'Account': r.account,
      'Category': r.category,
      'Amount': parseFloat(r.amount),
      'Currency': r.currency,
      'Note': r.note || '',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=cashier_export.xlsx');
    res.send(Buffer.from(buf));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
