# TODO

Todo application using Svelte, Postgres and Vercel

## Notes

The TODO application made is using Svelte, Postgres, Vercel.

- Dev: Github
- Web: Svelte
- API: SvelteKit
- DB: Postgres
- Deployment: Vercel & Railway

Will also use:

- Typescript
- Prisma
- NPM scripts

SvelteKit:

- Use already made todo from Svelte since UI is not important for this full-stack application, but the structure and technologies are.

CRUD:

- Create Todo, Read the Todos, Update Todo, Delete Todo.

Project architecture:

- Frontend and UI using Svelte, Hosting using SvelteKit on Vercel and will have the APIs exposed here.
- Frontend sends GET to SvelteKit, REST API on Sveltekit answers with JSON-object to the frontend.
- We need to send a SELECT \* FROM "Todos"; to the PostgreSQL database which sends the SQL response back.
- I use Prisma between the SvelteKit REST API and the PostgreSQL db, Prisma takes care of the SQL query translation and SQL response, converting both to acceptable formats, like GET-> SQL and SQL-> JSON.
- Full architecture style: Svelte <-> SvelteKit <-> Prisma <-> PostgreSQL.
