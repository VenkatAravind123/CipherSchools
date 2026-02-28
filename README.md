# CipherSQLStudio App

A modern SQL assessment platform that allows users to practice SQL queries against a live, sandboxed PostgreSQL database, evaluated by a NodeJS/Express backend, with Gemini AI-powered hints.

## Deliverables Checklist

- [x] GitHub Repository (Frontend & Backend)
- [x] `.env.example` provided for safe environment variable setup
- [x] Installation and Setup Instructions
- [x] Technology Choices Explanation

---

## 🛠️ Technology Choices Explanation

### Frontend:

- **React.js & Vite**: Vite provides a blazingly fast development server. React was chosen for its component-based architecture which makes building interactive UIs (like the SQL sandbox) highly maintainable.
- **Monaco Editor**: Used for the SQL query editor to provide a nice layout, syntax highlighting, and coding experience similar to VS Code.
- **Axios**: Standard, promise-based HTTP client for robust API communication and sending requests.
- **Vanilla CSS (SCSS)**: Included for structured, modular, and maintainable styling using nested rules and variables.

### Backend:

- **Node.js & Express**: Provides a fast, scalable structure for the API infrastructure.
- **MongoDB & Mongoose**: Utilized for user authentication, maintaining assignments data, and saving query submissions flexibly.
- **PostgreSQL**: Used as the SandBox Database. It reliably processes SQL queries under restricted permissions so user-submitted queries don't raise problems with the core app logic or schema design.
- **Google Generative AI (Gemini)**: Powers the dynamic "Hint" system by looking at the user's invalid query alongside the database schema and returning a suggestion to get the user answer the question with the right answer.
- **Bcrypt & JWT**: Secures user authentication loops and ensures sessions are verified seamlessly without complex server state.

---

## Environment Variables Needed

The backend requires several environment variables to function correctly. A template file `.env.example` has been provided in the `/backend` folder. **You must never share your `.env` file publicly**; instead, always provide an `.env.example` to let reviewers/coworkers know what configuration keys they need to supply.

You must create a `.env` file in the `backend/` directory using `.env.example` as a template:

```env
MONGO_DB_URL=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
PG_HOST=localhost
PG_PORT=5432
PG_USER=your_postgres_user
PG_PASSWORD=your_postgres_password
PG_DATABASE=your_postgres_database_name
API_KEY=your_gemini_api_key
```

### Explanation of variables:

- `MONGO_DB_URL`: Connection string for your MongoDB instance.
- `PORT`: Exposed port for local server (Default is `5000`).
- `JWT_SECRET`: A random secure string used to sign user authentication cookies securely.
- `PG_*`: Configuration credentials for the local PostgreSQL sandbox database. Ensure you create the respective db and user locally.
- `API_KEY`: API Key for Google Gemini, used to access AI-powered SQL hints.

_(No environment variables are strictly mandated for the frontend for this version; it defaults to polling the backend at `http://localhost:5000`)_

---

## Installation Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [PostgreSQL](https://www.postgresql.org/download/) (Installed and running locally)
- MongoDB (Running locally or using MongoDB Atlas)

### 1. Database Setup (PostgreSQL Sandbox)

You need to set up a blank PostgreSQL database to act as the sandbox.

1. Open up pgAdmin or your `psql` terminal shell.
2. Create a new database matching your `PG_DATABASE` env value (e.g., `ciphersql_sandbox`).
   ```sql
   CREATE DATABASE ciphersql_sandbox;
   ```
3. Make sure that the user defined in `PG_USER` (e.g., `postgres`) has connection rights to this schema.

### 2. Backend Setup

1. Open a new terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the necessary Node dependencies:
   ```bash
   npm install
   ```
3. Create the `.env` file:
   Copy `.env.example` to `.env` and fill in your actual credentials.
4. Start the backend Node server:
   ```bash
   npm run dev
   # or
   node server.js
   ```
   _(The server should start to spin up, usually on http://localhost:5000 unless modified)_

### 3. Frontend Setup

1. Open a separate terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the frontend Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the application in your browser at the Local URL printed by Vite (typically `http://localhost:5173`).

## Role Based Access:
There are two roles User and Admin:
There are two types of Dashboards for both roles after registering into your MongoDB database as a user try to change a user role as Admin to use the Admin Dashboard.

Admin:
Admin will be able to add assignments that are visible to the users.

User:
User can access the assignments added by the Admin and submit them.
