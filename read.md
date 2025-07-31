# LMS Project Setup and Local Database Start Guide

This guide explains how to set up and start the LMS project with a local MongoDB database.

## Prerequisites

- Node.js installed (https://nodejs.org/)
- MongoDB installed and running locally (https://www.mongodb.com/docs/manual/installation/)

## Backend Setup

1. Open a terminal and navigate to the `Backend` directory:

   ```bash
   cd Backend
   ```

2. Install backend dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `Backend` directory with the following content:

   ```
   MONGODB_URI=mongodb://localhost:27017/lms
   PORT=5000
   ```

   Adjust the MongoDB URI if your MongoDB instance uses a different port or requires authentication.

4. Start the backend server:

   ```bash
   node server.js
   ```

   The server will start on port 5000 (or the port specified in `.env`).

## Frontend Setup

1. Open a new terminal and navigate to the `Frontend` directory:

   ```bash
   cd Frontend
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:

   ```bash
   npm run dev
   ```

   This will start the frontend on the default Vite port (usually 5173).

## Optional: Seed Sample Data

The backend provides an endpoint to seed sample course data.

You can send a POST request to:

```
http://localhost:5000/api/seed
```

This will clear existing data and insert sample courses into the database.

You can use tools like Postman or curl to trigger this endpoint:

```bash
curl -X POST http://localhost:5000/api/seed
```

## Notes

- Ensure MongoDB is running locally before starting the backend server.
- The backend server uses environment variables from the `.env` file for configuration.
- The frontend and backend run as separate servers and communicate via API calls.

---

This completes the setup instructions for running the LMS project with a local MongoDB database.
