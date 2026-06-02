import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, ChevronLeft, ChevronRight, Send, Heart } from 'lucide-react';
import { Story } from '../types';

interface StoriesBarProps {
  stories: Story[];
  currentUserAvatar: string;
}

export default function StoriesBar({ stories, currentUserAvatar }: StoriesBarProps) {
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [viewedStories, setViewedStories] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: string; char: string; left: number }[]>([]);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mark story as viewed when opened
  useEffect(() => {
    if (activeStoryIdx !== null) {
      const currentStory = stories[activeStoryIdx];
      if (currentStory) {
        setViewedStories(prev => ({ ...prev, [currentStory.id]: true }));
      }
      setProgress(0);
      setIsPaused(false);
    }
  }, [activeStoryIdx, stories]);

  // Story Autoplayer & Progress Bar Tick
  useEffect(() => {
    if (activeStoryIdx === null || isPaused) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const intervalTime = 60; // Tick every 60ms
    const step = (intervalTime / 5000) * 100; // 5000ms duration per story

    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNextStory();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [activeStoryIdx, isPaused]);

  const handleNextStory = () => {
    if (activeStoryIdx === null) return;
    if (activeStoryIdx < stories.length - 1) {
      setActiveStoryIdx(activeStoryIdx + 1);
    } else {
      setActiveStoryIdx(null); // End of stories
    }
  };

  const handlePrevStory = () => {
    if (activeStoryIdx === null) return;
    if (activeStoryIdx > 0) {
      setActiveStoryIdx(activeStoryIdx - 1);
    } else {
      setProgress(0); // Restart current story if it is the first one
    }
  };

  const spawnEmoji = (emoji: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    // random horizontal percentage layout
    const left = 10 + Math.random() * 80;
    setFloatingEmojis(prev => [...prev, { id, char: emoji, left }]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id));
    }, 1500);
  };

  const sendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    spawnEmoji('✉️');
    setReplyText('');
  };

  const currentStory = activeStoryIdx !== null ? stories[activeStoryIdx] : null;

  return (
    <div className="w-full relative py-4 border-b border-zinc-800 bg-zinc-950/60 backdrop-blur-md px-1 select-none">
      {/* Horizontal List */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 items-center">
        {/* User's Story Slot */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
          <div className="relative">
            <img
              src={currentUserAvatar}
              alt="My Avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-zinc-900 group-hover:scale-105 transition-transform duration-300"
            />
            {/* YouTube/Instagram Plus Sign */}
            <span className="absolute bottom-0 right-0 bg-red-500 rounded-full text-white text-xs w-5 h-5 flex items-center justify-center border-2 border-zinc-950 font-bold group-hover:bg-red-600 transition-colors">
              +
            </span>
          </div>
          <span className="text-xs text-zinc-400 font-medium truncate w-16 text-center">My Story</span>
        </div>

        {/* Stories from others */}
        {stories.map((story, idx) => {
          const isViewed = viewedStories[story.id];
          return (
            <button
              key={story.id}
              id={`story-bubble-${story.id}`}
              onClick={() => setActiveStoryIdx(idx)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group focus:outline-none"
            >
              <div className="relative">
                {/* Status colored ring gradient (Instagram sunset colors or glowing red) */}
                <div className={`absolute -inset-1 rounded-full animate-pulse-slow ${
                  isViewed
                    ? 'bg-zinc-805 ring-1 ring-zinc-800'
                    : 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-red-600'
                }`} />
                <img
                  src={story.authorAvatar}
                  alt={story.author}
                  className="relative w-16 h-16 rounded-full object-cover border-2 border-zinc-950 group-hover:scale-105 transition-all duration-300"
                />
              </div>
              <span className="text-xs text-zinc-300 font-medium truncate w-18 text-center group-hover:text-zinc-100 transition-colors">
                {story.author}
              </span>
            </button>
          );
        })}
      </div>

      {/* FULL SCREEN STORY VIEW SLIDESHOW */}
      {currentStory && (
        <div className="fixed inset-0 bg-zinc-950/98 z-50 flex items-center justify-center p-0 md:p-4 select-none backdrop-blur-lg">
          <div className="relative w-full max-w-lg aspect-[9/16] md:rounded-3xl bg-black border border-zinc-900 shadow-2xl flex flex-col overflow-hidden">
            {/* Top Grid: Progress Indicators */}
            <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent z-10 flex flex-col gap-2">
              <div className="flex gap-1 w-full px-1">
                {stories.map((s, idx) => {
                  let barProgress = 0;
                  if (idx < (activeStoryIdx ?? 0)) barProgress = 100;
                  if (idx === activeStoryIdx) barProgress = progress;

                  return (
                    <div key={s.id} className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-75 ease-linear"
                        style={{ width: `${barProgress}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Author Info & Actions */}
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <img
                    src={currentStory.authorAvatar}
                    alt={currentStory.author}
                    className="w-9 h-9 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <p className="text-sm font-bold text-white leading-none">
                      {currentStory.author}
                    </p>
                    <span className="text-xs text-zinc-400 font-medium">
                      {currentStory.timestamp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-white">
                  {/* Pause / Resume button */}
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors focus:outline-none"
                  >
                    {isPaused ? <Play className="w-5 h-5 fill-white" /> : <Pause className="w-5 h-5 fill-white" />}
                  </button>
                  {/* Close button */}
                  <button
                    onClick={() => setActiveStoryIdx(null)}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors focus:outline-none"
                  >
                    <X className="w-5.5 h-5.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tap triggers Left/Right */}
            <div className="absolute inset-x-0 top-16 bottom-20 z-0 flex">
              <button
                onClick={handlePrevStory}
                className="w-1/3 h-full cursor-left focus:outline-none"
              />
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="w-1/3 h-full cursor-pointer focus:outline-none"
              />
              <button
                onClick={handleNextStory}
                className="w-1/3 h-full cursor-right focus:outline-none"
              />
            </div>

            {/* Back & Next Navigation Arrows on Desktop Screen margins */}
            <button
              onClick={handlePrevStory}
              disabled={activeStoryIdx === 0}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-zinc-900/60 hover:bg-zinc-800 text-white disabled:opacity-20 disabled:hover:bg-zinc-900/60 z-20 focus:outline-none border border-zinc-800"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNextStory}
              disabled={activeStoryIdx === stories.length - 1}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-zinc-900/60 hover:bg-zinc-800 text-white disabled:opacity-20 disabled:hover:bg-zinc-900/60 z-20 focus:outline-none border border-zinc-800"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Floating emoji rendering container */}
            <div className="absolute bottom-24 inset-x-0 h-48 pointer-events-none overflow-hidden z-20">
              {floatingEmojis.map(emoji => (
                <div
                  key={emoji.id}
                  className="absolute bottom-0 text-3xl animate-bounce-float"
                  style={{ left: `${emoji.left}%` }}
                >
                  {emoji.char}
                </div>
              ))}
            </div>

            {/* Story Media (Standard Image representation) */}
            <div className="flex-1 w-full h-full bg-zinc-950 flex items-center justify-center">
              <img
                src={currentStory.mediaUrl}
                alt="Story content"
                className="w-full max-h-full object-contain pointer-events-none"
              />
            </div>

            {/* Quick Reactions bar (Instagram story feeling) */}
            <div className="absolute bottom-20 inset-x-0 flex items-center justify-center gap-4 bg-gradient-to-t from-black/80 to-transparent p-3 z-10">
              {['🔥', '❤️', '😂', '👏', '😮', '😢'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => spawnEmoji(emoji)}
                  className="text-2xl hover:scale-125 hover:rotate-3 transition-transform duration-200 active:scale-95 cursor-pointer focus:outline-none block"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Bottom Form Interaction */}
            <div className="p-3 bg-zinc-950 border-t border-zinc-900 z-10 flex items-center gap-3">
              <form onSubmit={sendReply} className="flex-1 flex items-center relative bg-zinc-900 rounded-full border border-zinc-800 px-4 py-2 hover:border-zinc-700 transition-colors">
                <input
                  type="text"
                  placeholder={`Reply to ${currentStory.author}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none outline-none pr-8"
                  onFocus={() => setIsPaused(true)}
                  onBlur={() => setIsPaused(false)}
                />
                <button
                  type="submit"
                  className="absolute right-3.5 text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>

              <button
                onClick={() => spawnEmoji('❤️')}
                className="p-2.5 bg-zinc-905 hover:bg-zinc-800 border border-zinc-800/80 rounded-full text-zinc-300 hover:text-red-500 transition-all cursor-pointer"
              >
                <Heart className="w-5.5 h-5.5 fill-red-500 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bounce-Float & pulse animations in CSS */}
      <style>{`
        @keyframes bounceFloat {
          0% {
            transform: translateY(0) scale(0.6);
            opacity: 1;
          }
          100% {
            transform: translateY(-160px) scale(1.4);
            opacity: 0;
          }
        }
        .animate-bounce-float {
          animation: bounceFloat 1.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
