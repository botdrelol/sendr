# Sendr

A mobile-friendly climbing session tracker built with React and Supabase.

## Features

- Log climbing sessions with date, location, duration, and notes
- Track individual routes per session with grade, style, and result
- Attach photos and videos to each route
- View grade progression and stats over time

## Tech stack

- React (Vite)
- Supabase (PostgreSQL database + file storage)
- Recharts

## Live demo

https://sendr-nine.vercel.app/

## Screenshots

<img width="613" height="620" alt="image" src="https://github.com/user-attachments/assets/86ea60a0-4f52-492b-a4b4-7b38293b8bff" />
<img width="577" height="970" alt="image" src="https://github.com/user-attachments/assets/e784bd27-a1e8-4316-9943-a8beeeb84fad" />
<img width="564" height="711" alt="image" src="https://github.com/user-attachments/assets/2fd71ca1-902e-444f-8c44-4bc0fc813300" />


## Running locally

1. Clone the repo
2. Run `npm install`
3. Create a `.env` file with your Supabase credentials:
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
4. Run `npm run dev`
