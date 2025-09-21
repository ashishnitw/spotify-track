// app/api/auth/login/route.js
export async function GET() {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const redirect_uri = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/callback`;

  const scope = [
    'user-read-playback-state',
    'user-read-currently-playing',
    'user-top-read',
  ].join(' ');

  const params = new URLSearchParams({
    response_type: 'code',
    client_id,
    scope,
    redirect_uri,
    show_dialog: 'true',
  });

  return new Response(null, { status: 302, headers: { Location: `https://accounts.spotify.com/authorize?${params.toString()}` } });
}