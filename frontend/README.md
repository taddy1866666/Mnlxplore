# MNLXPLORE Frontend

Next.js-based frontend for the MNLXPLORE AI travel assistant.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. Run development server:
```bash
npm run dev
```

Visit `http://localhost:3000`

## Available Pages

- `/` - Landing page
- `/planner` - AI trip planner
- `/explore` - Destination explorer
- `/login` - User login
- `/register` - User registration
- `/dashboard` - User dashboard (requires auth)

## Technologies

- Next.js 14
- React 18
- Tailwind CSS
- Lucide React (icons)
- Axios (HTTP client)
