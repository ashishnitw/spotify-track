'use client';
import { useState } from 'react';
import NowPlaying from '@/components/NowPlaying';
import { TopTracksRecent, TopTracksMedium, TopTracksLongTerm } from '@/components/TopTracks';

export default function Home() {
  const [activeTab, setActiveTab] = useState('recent');

  return (
    <main className="min-h-screen bg-[#121212] text-white pb-25">
      {/* Now Playing Bar */}
      <NowPlaying />

      {/* Tabs */}
      <div className="max-w-3xl mx-auto pt-10">
        <div className="flex border-b border-gray-700 mb-6">
          {['recent', 'medium', 'long'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === tab
                ? 'text-white border-b-2 border-green-500'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              {tab === 'recent'
                ? 'Recent'
                : tab === 'medium'
                  ? 'Last 6 Months'
                  : 'All Time'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'recent' && <TopTracksRecent />}
          {activeTab === 'medium' && <TopTracksMedium />}
          {activeTab === 'long' && <TopTracksLongTerm />}
        </div>
      </div>
    </main>
  );
}
