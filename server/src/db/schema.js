import { pgTable, uuid, varchar, text, numeric, timestamp, pgEnum, integer } from 'drizzle-orm/pg-core';

export const accountTypeEnum = pgEnum('account_type', ['card', 'cash', 'crypto', 'assets']);
export const transactionTypeEnum = pgEnum('transaction_type', ['expense', 'income', 'transfer']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }),
  avatar: text('avatar'),
  googleId: varchar('google_id', { length: 255 }).unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  type: accountTypeEnum('type').notNull().default('card'),
  currency: varchar('currency', { length: 10 }).notNull().default('EUR'),
  balance: numeric('balance', { precision: 12, scale: 2 }).notNull().default('0'),
  icon: varchar('icon', { length: 10 }),
  color: varchar('color', { length: 7 }),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  type: transactionTypeEnum('type').notNull().default('expense'),
  icon: varchar('icon', { length: 10 }),
  color: varchar('color', { length: 7 }),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  accountId: uuid('account_id').references(() => accounts.id, { onDelete: 'cascade' }).notNull(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  type: transactionTypeEnum('type').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).notNull().default('EUR'),
  note: text('note'),
  date: timestamp('date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
