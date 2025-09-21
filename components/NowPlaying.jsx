'use client';
import { useEffect, useState } from 'react';

export default function NowPlaying() {
  const [nowPlaying, setNowPlaying] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function fetchNowPlaying() {
      try {
        const res = await fetch('/api/spotify/now');
        const data = await res.json();
        console.log('nowPlaying', data);
        setNowPlaying(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (nowPlaying?.is_playing && nowPlaying.progress_ms && nowPlaying.item?.duration_ms) {
      setProgress((nowPlaying.progress_ms / nowPlaying.item.duration_ms) * 100);
    } else {
      setProgress(0);
    }
  }, [nowPlaying]);

  if (!nowPlaying?.item) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-gray-700 px-4 py-3 flex items-center justify-center shadow-lg">
        <p className="text-gray-400 text-sm italic animate-pulse">
          No song is currently playing
        </p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-gray-700 px-4 py-3 flex items-center shadow-lg">
      <img
        src={nowPlaying.item.album.images[0].url}
        alt={nowPlaying.item.name}
        className="w-12 h-12 rounded mr-4"
      />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-white">
              <a
                href={nowPlaying.item.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {nowPlaying.item.name}
              </a>
            </p>
            <p className="text-xs text-gray-400">
              {nowPlaying.item.artists.map((a, i) => (
                <span key={a.id}>
                  <a
                    href={a.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {a.name}
                  </a>
                  {i < nowPlaying.item.artists.length - 1 && ', '}
                </span>
              ))}
            </p>
          </div>
          <span className="text-xs text-gray-400">
            {Math.floor(nowPlaying.progress_ms / 1000 / 60)}:
            {(Math.floor(nowPlaying.progress_ms / 1000) % 60).toString().padStart(2, '0')}
            {" / "}
            {Math.floor(nowPlaying.item.duration_ms / 1000 / 60)}:
            {(Math.floor(nowPlaying.item.duration_ms / 1000) % 60).toString().padStart(2, '0')}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 h-1.5 mt-1 rounded-full">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 animate-[progressGlow_2s_ease-in-out_infinite]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

      </div>
    </div>
  );
}
