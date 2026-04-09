# YourLife

A full-stack social web application: feed posts, comments and likes, user profiles, followers, real-time notifications and chat, and photo uploads backed by cloud storage.

## Stack

| Layer | Technology |
| --- | --- |
| **API** | Node.js, Express |
| **Database** | MongoDB (Mongoose) |
| **Auth** | Passport (local strategy), sessions, bcrypt |
| **Real-time** | Socket.IO |
| **Media** | AWS S3 (`aws-sdk`) |
| **Web UI** | React 17 (Create React App), React Router v5, Axios, Framer Motion |

## Project layout

- **`server.js`** — Express app, HTTP + Socket.IO server, MongoDB connection, serves the production React build from `client/build`.
- **`client/`** — React SPA; in development it runs its own dev server and talks to the API on port 4000.
- **`routes/`** — REST-style handlers (`Account`, `Story`, `Photo`, `Notification`, `Chat`, etc.).
- **`model/`** — Mongoose models (users, posts/stories, comments, likes, chats, notifications, etc.).
- **`helper/`** — S3 upload/stream helpers.

## Prerequisites

- **Node.js** (LTS recommended)
- **MongoDB** (local or Atlas) — connection string in `DB_CONNECTION`
- **AWS account** — S3 bucket and IAM credentials for photo uploads (see environment variables)

## Environment variables

Create a `.env` file in the **repository root** (same folder as `server.js`). The server loads it via `dotenv`.

| Variable | Purpose |
| --- | --- |
| `DB_CONNECTION` | MongoDB connection URI (required for the app to persist data). |
| `PORT` | HTTP port (default **4000** if unset). |
| `AWS_BUCKET_NAME` | S3 bucket for uploaded files. |
| `AWS_BUCKET_REGION` | AWS region for that bucket. |
| `AWS_BUCKET_ACCESS_KEY` | IAM access key for S3 uploads. |
| `AWS_BUCKET_SECRET_KEY` | IAM secret key for S3 uploads. |

The React client uses `http://localhost:4000` as the API and Socket.IO URL when **`NODE_ENV` is `development`** (the default when you run `npm start` in `client/`). See `client/src/config.js`.

**Security note:** Session secrets and CORS origins are currently fixed in code (`server.js`). For production, move secrets to environment variables and set CORS to your real frontend origin.

## Local development

Run the API and the React dev app in two terminals so the UI on port 3000 can reach the API on port 4000 with credentials.

1. **Install dependencies**

   ```bash
   npm install
   cd client && npm install && cd ..
   ```

2. **Start the backend** (from the repo root)

   ```bash
   npm start
   ```

   API and sockets listen on `http://localhost:4000` (or `PORT`).

3. **Start the React app** (second terminal)

   ```bash
   cd client
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000). The dev build proxies API calls to the backend as configured in `client/src/config.js`.

Optional: use **`npm run devStart`** instead of `npm start` for the server if you have [nodemon](https://nodemon.io/) available (`nodemon server.js`).

## Production build

Build the client and run a single Node process that serves the API and the static SPA:

```bash
cd client && npm run build && cd ..
npm start
```

The `heroku-postbuild` script in `package.json` installs client dependencies and runs `npm run build` in `client/` for Heroku-style deployments.

## npm scripts (root)

| Script | Command |
| --- | --- |
| `npm start` | `node server.js` |
| `npm run devStart` | `nodemon server.js` (requires nodemon) |
| `heroku-postbuild` | Installs and builds the `client` app for deployment |

## Client scripts (`client/`)

| Script | Description |
| --- | --- |
| `npm start` | React dev server (port 3000) |
| `npm run build` | Production bundle to `client/build` |
| `npm test` | Jest test runner (interactive watch) |

## License

ISC (see `package.json`).
