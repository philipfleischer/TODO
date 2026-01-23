# Todo App — SvelteKit + Prisma + PostgreSQL

---

A modern full-stack Todo application built with SvelteKit on the frontend, Prisma ORM for database access, and PostgreSQL hosted on Neon.
The application is deployed serverlessly on Vercel.

This project is intended as a realistic portfolio example, focusing on modern tooling, clean architecture, and real-world deployment workflows rather than being just a UI demo.

⸻

## Live Demo

Vercel deployment Live Demo:
https://github.com/user-attachments/assets/0204f0df-9fce-484a-aec4-8a4787bf0857

---

## Tech Stack

**Frontend**

- Svelte 5
- SvelteKit
- Vite

**Backend**

- SvelteKit server routes
- Prisma ORM (v7)
- PostgreSQL (Neon)

**Deployment**

- Vercel (serverless functions)
- Neon (managed PostgreSQL)

---

## Features

- Full CRUD functionality for todos
- Data persistence using PostgreSQL
- Optimistic UI updates (no full page reloads)
- Server-side database access via Prisma
- Production-ready deployment on Vercel

⸻

## Local Development

Prerequisites

- Node.js (18+ recommended)
- npm
- PostgreSQL database (Neon recommended)

⸻

## Environment Variables

Create a .env file in the project root:

DATABASE_URL=“postgresql://:@/?sslmode=require”

⸻

## Install Dependencies

npm install

⸻

## Prisma Setup

Generate Prisma client and run migrations:

npx prisma generate
npx prisma migrate dev

⸻

## Start Development Server

npm run dev

The application will be available at:

http://localhost:5173

⸻

## Prisma Studio (optional)

To inspect and manage database content locally:

npx prisma studio

⸻

## Production Build

npm run build
npm run preview

⸻

## Deployment

Vercel

The application is deployed on Vercel using a serverless adapter.

Production build command:

prisma generate && prisma migrate deploy && npm run build

⸻

## Deployment

Vercel deployment
https://vercel.com/philipfleischers-projects/todo-of7e

PostgreSQL (Neon console)
https://console.neon.tech/

⸻

## Project Structure (simplified)

src/

- lib/
- server/
- prisma.ts Prisma client configuration
- todos.ts Database access logic
- todo-item.svelte Todo UI component

routes/

- +page.svelte Main page
- +page.ts Data loading
- todos/
- [uid].json/ API routes (GET, POST, PATCH, DELETE)

prisma/

- schema.prisma Prisma schema
- migrations/ Database migrations

⸻

## Notes

- The database schema is managed via Prisma migrations
- All todos created through the UI are persisted directly to PostgreSQL
- Neon was chosen for its simplicity and serverless-friendly setup
- The project demonstrates a complete full-stack workflow suitable for portfolio use

⸻

## Future Improvements

- Authentication
- User-specific todos
- Pagination and filtering
- Automated testing
- CI/CD checks

⸻

## License

MIT

⸻

## Acknowledgements

This project draws initial inspiration from the following tutorial:
https://www.youtube.com/watch?v=OUzaUJ3gEug

While the tutorial provided a baseline concept for building a Todo app, I have refactored, enhanced, and extended the implementation extensively — including adding a custom backend with PostgreSQL, Prisma ORM, authentication structure (if any), UI improvements, deployment configuration on Vercel, and more. All code enhancements and design choices are my own.
