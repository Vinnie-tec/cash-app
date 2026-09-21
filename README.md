# Cash App

Cash App is a personal finance tracker built with Next.js. It lets authenticated users record income and expenses, organize transactions by category, review recent activity, and understand their cash flow across an entire year.

## Features

- Clerk sign-in and sign-up
- Protected dashboard and transaction routes
- Income and expense transactions
- Categories filtered by transaction type
- Monthly transaction list with year and month filters
- Annual income and expense cash-flow chart
- Recent transactions overview
- Edit and delete actions limited to the signed-in user
- Client-side and server-side validation with Zod
- Responsive UI built with Tailwind CSS and Radix UI primitives

## Tech stack

- [Next.js 15](https://nextjs.org/) with the App Router
- React 18 and TypeScript
- [Clerk](https://clerk.com/) for authentication
- [Neon](https://neon.tech/) serverless PostgreSQL
- [Drizzle ORM](https://orm.drizzle.team/) and Drizzle Kit
- Tailwind CSS
- React Hook Form and Zod
- Recharts for data visualization
- date-fns for date formatting and date calculations

## Requirements

- Node.js 20 or newer
- A PostgreSQL database. A Neon database is recommended because the project uses `@neondatabase/serverless`.
- A Clerk application

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local` in the project root:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

Get the Clerk keys from the Clerk Dashboard. `DATABASE_URL` must point to the PostgreSQL database that will store the categories and transactions.

### 3. Create the database tables

The schema is defined in `db/schema.ts`. Push it to the configured database with Drizzle Kit:

```bash
npx drizzle-kit push
```

### 4. Seed transaction categories

The seed script creates the default income and expense categories:

```bash
npx tsx seed.ts
```

Run the seed script once for a new database. Running it again inserts the categories again, so avoid repeated runs unless duplicate seed data is acceptable.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server with Webpack |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server after building |
| `npm run lint` | Run the configured Next.js lint command |
| `npx drizzle-kit push` | Apply the current Drizzle schema to PostgreSQL |
| `npx tsx seed.ts` | Insert the default categories |

## Using the application

1. Open the home page and create an account or sign in.
2. Go to the dashboard.
3. Use the annual cash-flow view to compare monthly income and expenses. The year can be selected through the dashboard query string, for example `/dashboard?cfyear=2026`.
4. Open the transactions view to inspect one month at a time. The month and year are controlled with query parameters, for example `/dashboard/transactions?month=9&year=2026`.
5. Select **New Transaction**, choose income or expense, select a matching category, enter a date, amount, and description, and submit the form.
6. Use the edit action beside a transaction to update it, or delete it from the transaction detail page.

Transaction dates cannot be in the future, amounts must be positive, and descriptions must contain between 3 and 300 characters.

## Application structure

| Path | Responsibility |
| --- | --- |
| `app/page.tsx` | Public landing page |
| `app/layout.tsx` | Clerk provider and global navigation |
| `app/dashboard/` | Protected dashboard area |
| `app/dashboard/page.tsx` | Annual cash flow and recent transactions |
| `app/dashboard/transactions/` | Monthly transaction list and filters |
| `app/dashboard/transactions/new/` | Create transaction flow |
| `app/dashboard/transactions/[transactionId]/` | View, edit, and delete flow |
| `components/transaction-form.tsx` | Shared validated transaction form |
| `components/ui/` | Reusable UI primitives |
| `data/` | Server-side database queries |
| `db/schema.ts` | Drizzle PostgreSQL schema |
| `db/index.ts` | Neon database connection |
| `validation/` | Server-side Zod schemas |
| `seed.ts` | Default category data |
| `middleware.ts` | Clerk protection for `/dashboard` routes |

## Data model

The database has two tables:

### `categories`

Stores reusable categories such as Salary, Housing, Food & Groceries, and Transport. Each category has a `type` of either `income` or `expense`.

### `transactions`

Stores a user's description, amount, transaction date, category, and Clerk user ID. Every transaction query and mutation checks the authenticated user's ID, so users only see and modify their own transactions.

## Request and data flow

1. Clerk authenticates the user in `middleware.ts` and the dashboard layout.
2. Server components call the functions in `data/` to query PostgreSQL through Drizzle.
3. The dashboard groups transactions by month and calculates income and expenses from the category type.
4. The transaction form validates input in the browser with React Hook Form and Zod.
5. Server actions validate the submitted data again, attach the authenticated `userId`, and write through Drizzle.
6. The UI redirects to the relevant month and displays a success or error toast.

## Security notes

- Keep `.env.local` out of source control.
- Never expose `CLERK_SECRET_KEY` or `DATABASE_URL` to client components.
- Authentication is enforced on the server, not only through hidden UI controls.
- Transaction reads, updates, and deletes include the authenticated `userId` in their database conditions.

## Production deployment

Before deploying:

1. Add the production `DATABASE_URL` and Clerk keys to the hosting provider's environment settings.
2. Add the production domain to the allowed origins and redirect URLs in Clerk.
3. Apply the Drizzle schema to the production database and seed categories.
4. Build and start the app:

```bash
npm run build
npm run start
```

Vercel is a natural deployment target for this Next.js application, but any host that supports the Next.js production server can run it.

## Current limitations

- Categories are seeded globally and are not managed through the UI.
- The seed script does not prevent duplicate category rows.
- There are no automated tests in the repository yet.
- Currency display is currently formatted as pounds (`£`) in the transaction list.
