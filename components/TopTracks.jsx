'use client';
import { useEffect, useState } from 'react';

/* ----------------- Reusable SongList ----------------- */
function SongList({ tracks }) {
  if (!tracks.length) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <ul className="space-y-2">
        {tracks.map((track, idx) => (
          <li
            key={track.id}
            className="flex items-center gap-4 px-2 py-2 rounded-lg hover:bg-[#1e1e1e] transition-colors group"
          >
            {/* Index */}
            <span className="w-6 text-right text-gray-400 group-hover:text-white">
              {idx + 1}
            </span>

            {/* Album Art */}
            <a
              href={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={track.album.images[0].url}
                alt={track.name}
                className="w-8 h-8 rounded object-cover hover:opacity-80 transition"
              />
            </a>

            {/* Song Info */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm">
                <a
                  href={track.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {track.name}
                </a>
              </p>
              <p className="text-xs text-gray-300 truncate">
                {track.artists.map((a, i) => (
                  <span key={a.id}>
                    <a
                      href={a.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {a.name}
                    </a>
                    {i < track.artists.length - 1 && ', '}
                  </span>
                ))}
              </p>
            </div>

            {/* Duration */}
            <span className="text-xs text-gray-400">
              {Math.floor(track.duration_ms / 1000 / 60)}:
              {(Math.floor(track.duration_ms / 1000) % 60).toString().padStart(2, '0')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ----------------- Reusable fetch hook ----------------- */
function useTopTracks(timeRange) {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    async function fetchTopTracks() {
      try {
        const res = await fetch(`/api/spotify/top?type=tracks&time_range=${timeRange}&limit=10`);
        const data = await res.json();
        setTracks(data.items || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchTopTracks();
  }, [timeRange]);

  return tracks;
}

/* ----------------- Recent Top Tracks ----------------- */
export function TopTracksRecent() {
  const tracks = useTopTracks('short_term');
  return <SongList tracks={tracks} />;
}

/* ----------------- Medium-Term Top Tracks ----------------- */
export function TopTracksMedium() {
  const tracks = useTopTracks('medium_term');
  return <SongList tracks={tracks} />;
}

/* ----------------- Long-Term Top Tracks ----------------- */
export function TopTracksLongTerm() {
  const tracks = useTopTracks('long_term');
  return <SongList tracks={tracks} />;
}