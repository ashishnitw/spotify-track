// app/api/spotify/now/route.js
import { fetchNowPlaying } from '@/lib/spotify';

export async function GET() {
  try {
    const data = await fetchNowPlaying();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.error('Error /api/spotify/now', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}