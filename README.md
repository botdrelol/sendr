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



## Running locally

1. Clone the repo
2. Run `npm install`
3. Create a `.env` file with your Supabase credentials:
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
4. Run `npm run dev`