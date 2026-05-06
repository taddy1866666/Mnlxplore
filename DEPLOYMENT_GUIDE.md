# Deployment Guide: Mnlxplore

Your project has been successfully initialized with Git and pushed to GitHub. Follow these steps to complete the deployment to Vercel and set up your backend.

## 1. GitHub Repository
The code is already pushed to:
**[https://github.com/taddy1866666/Mnlxplore.git](https://github.com/taddy1866666/Mnlxplore.git)**

## 2. Deployment (Vercel Services)
You are using **Vercel Experimental Services**, which allows you to host both the frontend and backend in a single Vercel project.

1.  Go to [Vercel](https://vercel.com/) and log in with your GitHub account.
2.  Click **"Add New..."** > **"Project"**.
3.  Import the `Mnlxplore` repository.
4.  In the **Configure Project** screen:
    - **Framework Preset:** Select **"Services"** (This is crucial!).
    - **Root Directory:** Keep it as the project root (don't select `frontend`).
    - **Environment Variables:** Add your variables for both:
        - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (for frontend)
        - `MONGODB_URI`, `JWT_SECRET`, etc. (for backend)
        - `NEXT_PUBLIC_API_URL`: Set this to `/_/backend` (relative path) or leave blank if you update `api.js`.
5.  Click **Deploy**.

## 3. Connecting Frontend and Backend
Since they share the same domain under Vercel Services:
- The frontend is at `/`
- The backend is at `/_/backend`

In your `frontend/utils/api.js`, you can set `NEXT_PUBLIC_API_URL` to `/_/backend` in your Vercel environment variables.



## 5. Database (MongoDB Atlas)
If you haven't already, set up a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) to get a production database URL for your `MONGODB_URI`.
