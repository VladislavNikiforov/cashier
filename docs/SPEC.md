# CashierMoneyManager — Specification

## Platform
- Web app (browser, including Telegram in-app browser)
- Mobile-first, dark theme only
- NOT a Telegram Mini App, NOT native

## Tech Stack
- Performance priority, lightweight JS framework
- Server-side data storage, account-bound
- Continuous sync

## Auth
- MVP: Google OAuth or login/password
- Future: Telegram auth, other providers (keep architecture open)

## MVP 1
- Main screen: donut chart (auto-generated from categories)
- Add income/expense transactions
- Create/delete categories with custom icons
- Multi-account support
- Transactions tab: filterable by any period, month navigation via arrows
- Settings: account page, Excel export, import button (no validation)
- NO budget tab in MVP 1

## Version 2
- Tags on transactions
- Grouping: categories → groups → tags
- Recurring transactions
- Multi-currency (up to 5, real exchange rates)
- Receipt photos
- Import validation + format instructions
- Advanced analytics: chart presets, editable reports, metric selection, correlations (simplified Power BI)

## Design Reference: 1Money
- Dark theme
- Donut chart center with category breakdown
- Category icons with colored circles
- Transaction list grouped by date
- Period selector (day/week/month/year/range/all time)
- Bottom nav: Accounts, Categories, Transactions, Budget, Overview
- Accounts: Regular, Debt, Savings types
- Overview: bar chart + daily/weekly/monthly averages + category breakdown

## CSV Export Format (1Money reference)
Columns: DATE, TYPE, FROM ACCOUNT, TO ACCOUNT/TO CATEGORY, AMOUNT, CURRENCY, AMOUNT 2, CURRENCY 2, TAGS, NOTES

## User's Categories (from 1Money)
### Expenses
Продукты, Кафе, Bad Досуг, Транспорт, Инвестиции, Подарки, Долги, Покупки, Соло, Здоровье, Good досуг, Путешествия

### Income
ZZ нал, ZZ карта, Долги, подарки, Чаевые, темки, GastroTech

## Accounts
- Карта (primary)
- Наличные
