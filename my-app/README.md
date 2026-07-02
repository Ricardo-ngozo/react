# FM Scout — La Liga Club Index

A three-page React application built with Vite and React Router v6.

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Lists all five La Liga clubs |
| `/item/:id` | Detail | Shows stats for the club matching the URL param |
| `*` | 404 | Catches unknown routes and unmatched IDs |

## Stack

- React 18
- React Router v6 (`createBrowserRouter`)
- Vite

## Running locally

```bash
npm install
npm run dev
```

## Routing notes

- Navigation is fully client-side — no page refresh on link clicks
- The Detail page reads its `id` from `useParams()` and matches against the local data array
- Unknown IDs redirect to `/404` via `useNavigate`
- The 404 page handles both unmatched routes and router-level errors via `useRouteError`

## Deployment

Deployed via Netlify. Please select your underdoh team and tell me via my grade feedback for this.