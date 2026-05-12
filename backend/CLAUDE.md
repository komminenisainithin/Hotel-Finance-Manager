# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hotel Finance Manager backend — a Node.js/Express REST API backed by MongoDB Atlas. The project is in early development; core dependencies are installed but most routes, models, and controllers are yet to be built.

## Tech Stack

- **Runtime:** Node.js with ES modules (`"type": "module"` in package.json)
- **Framework:** Express.js v5
- **Database:** MongoDB Atlas via Mongoose v9
- **Auth:** JWT (`jsonwebtoken`) + `bcryptjs` for password hashing
- **Config:** `dotenv` (`.env` at repo root)

## Running the App

There are currently no `start` or `dev` scripts defined. Add them to `package.json` before running:

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

Then:
```bash
npm install
npm run dev      # development (hot-reload via nodemon)
npm start        # production
```

The server listens on `PORT` from `.env` (default `5000`).

## Environment Variables

Copy `.env` and populate locally. Required variables:

| Variable | Purpose |
|---|---|
| `PORT` | HTTP server port (default 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for signing JWTs (add this) |

## Project Structure (intended)

```
src/
├── app.js          # Express app init, middleware, route mounting
├── server.js       # DB connect + server listen (entry point)
├── models/         # Mongoose schemas
├── routes/         # Express routers
├── controllers/    # Route handler logic
└── middleware/     # Auth, error handling, etc.
```

## Architecture Notes

- `src/app.js` initialises Express and should wire up CORS, JSON body parsing, and routes.
- `src/server.js` is the entry point — it connects to MongoDB then starts the HTTP server.
- Use `bcryptjs` for password hashing (not `bcrypt` — both are installed but keep only `bcryptjs` to avoid native bindings).
- All imports must use ESM syntax (`import`/`export`); CommonJS `require()` is not supported.
