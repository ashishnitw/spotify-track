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
        <p className="text-sm text-gray-400">Not playing anything right now 🎶</p>
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
            <p className="text-sm font-semibold text-white">{nowPlaying.item.name}</p>
            <p className="text-xs text-gray-400">{nowPlaying.item.artists.map(a => a.name).join(', ')}</p>
          </div>
          <span className="text-xs text-gray-400">
            {Math.floor(nowPlaying.progress_ms / 1000 / 60)}:
            {(Math.floor(nowPlaying.progress_ms / 1000) % 60).toString().padStart(2, '0')}
            /
            {Math.floor(nowPlaying.item.duration_ms / 1000 / 60)}:
            {(Math.floor(nowPlaying.item.duration_ms / 1000) % 60).toString().padStart(2, '0')}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
          <div
            className="bg-green-500 h-1 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
