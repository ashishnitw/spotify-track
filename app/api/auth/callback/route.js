// app/api/auth/callback/route.js
import querystring from 'querystring';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    if (error) {
      return new Response(`<h1>Spotify Auth Error</h1><pre>${error}</pre>`, { status: 400, headers: { 'Content-Type': 'text/html' } });
    }

    if (!code) {
      return new Response('<h1>No code returned</h1>', { status: 400, headers: { 'Content-Type': 'text/html' } });
    }

    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: querystring.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/callback`,
      }),
    });

    const payload = await tokenRes.json();

    // payload contains access_token, token_type, scope, expires_in, refresh_token
    const refresh_token = payload.refresh_token;

    // Show the refresh token to the user with instructions to copy it into .env.local
    const html = `
      <h1>Spotify OAuth - Success</h1>
      <p>Copy the <strong>refresh_token</strong> below into your <code>.env.local</code> as <code>SPOTIFY_REFRESH_TOKEN</code>.</p>
      <pre>${refresh_token}</pre>
      <p><strong>Important:</strong> Do not commit this value to version control.</p>
    `;

    return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html' } });
  } catch (err) {
    console.error('Callback error', err);
    return new Response(`<h1>Server error</h1><pre>${err.message}</pre>`, { status: 500, headers: { 'Content-Type': 'text/html' } });
  }
}