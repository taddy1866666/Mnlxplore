# Deployment Guide: Mnlxplore

Your project has been successfully initialized with Git and pushed to GitHub. Follow these steps to complete the deployment to Vercel and set up your backend.

## 1. GitHub Repository
The code is already pushed to:
**[https://github.com/taddy1866666/Mnlxplore.git](https://github.com/taddy1866666/Mnlxplore.git)**

## 2. Frontend Deployment (Vercel)
Vercel is the best place for your Next.js frontend.

1.  Go to [Vercel](https://vercel.com/) and log in with your GitHub account.
2.  Click **"Add New..."** > **"Project"**.
3.  Import the `Mnlxplore` repository.
4.  In the **Configure Project** screen:
    - **Framework Preset:** Next.js (should be auto-detected).
    - **Root Directory:** Click "Edit" and select the `frontend` folder.
    - **Environment Variables:** Add any variables from your `frontend/.env.local` (e.g., `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`).
    - **Note:** You will also need to add `NEXT_PUBLIC_API_URL` once your backend is deployed (see below).
5.  Click **Deploy**.

## 3. Backend Deployment (Render - Recommended)
Since your backend is a standard Node.js/Express server, **Render** or **Railway** are easier to set up than Vercel for this specific structure.

### Using Render:
1.  Go to [Render.com](https://render.com/) and log in with GitHub.
2.  Click **"New +"** > **"Web Service"**.
3.  Connect your GitHub repo.
4.  In the settings:
    - **Name:** `mnlxplore-backend`
    - **Root Directory:** `backend`
    - **Runtime:** `Node`
    - **Build Command:** `npm install`
    - **Start Command:** `node server.js`
5.  **Environment Variables:** Add your `.env` variables:
    - `MONGODB_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas).
    - `JWT_SECRET`: A random strong string.
    - `CLIENT_URL`: The URL of your Vercel frontend (e.g., `https://mnlxplore.vercel.app`).
6.  Click **Create Web Service**.

## 4. Connecting Frontend and Backend
Once your backend is live on Render (e.g., `https://mnlxplore-backend.onrender.com`):

1.  Go back to your **Vercel Project Settings**.
2.  Go to **Environment Variables**.
3.  Add/Update `NEXT_PUBLIC_API_URL` with your Render backend URL.
4.  Redeploy the frontend to apply the changes.

## 5. Database (MongoDB Atlas)
If you haven't already, set up a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) to get a production database URL for your `MONGODB_URI`.
