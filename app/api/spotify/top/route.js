// app/api/spotify/top/route.js
import { fetchTopTracks } from '@/lib/spotify';

export async function GET(req) {
  try {
    // allow query param ?limit=10
    const url = new URL(req.url);
    const limit = url.searchParams.get('limit') || '10';
    const time_range = url.searchParams.get('time_range') || 'short_term';
    const data = await fetchTopTracks(Number(limit), time_range);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.error('Error /api/spotify/top', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}