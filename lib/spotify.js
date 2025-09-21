// lib/spotify.js

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

function getBasicAuthHeader() {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) throw new Error('SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET not set');
  return Buffer.from(`${id}:${secret}`).toString('base64');
}

export async function getAccessTokenFromRefreshToken() {
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${getBasicAuthHeader()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to refresh token: ${res.status} ${txt}`);
  }
  return res.json(); // returns { access_token, token_type, expires_in, scope }
}

export async function fetchNowPlaying() {
  const tokenRes = await getAccessTokenFromRefreshToken();
  const access_token = tokenRes.access_token;
  const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (res.status === 204) return { is_playing: false };
  if (res.status === 401) {
    // token might have expired or refresh token revoked
    throw new Error('Unauthorized when fetching now playing. Check refresh token');
  }
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Spotify API error (now-playing): ${res.status} ${txt}`);
  }
  return res.json();
}

export async function fetchTopTracks(limit = 10, time_range = 'short_term') {
  const tokenRes = await getAccessTokenFromRefreshToken();
  const access_token = tokenRes.access_token;
  const url = `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=${time_range}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Spotify API error (top-tracks): ${res.status} ${txt}`);
  }
  return res.json();
}