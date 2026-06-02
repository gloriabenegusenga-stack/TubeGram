import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, ThumbsDown, MessageCircle, Share2, Volume2, VolumeX,
  ChevronDown, ChevronUp, Play, Pause, Bookmark, Music, UserCheck, MessageSquare
} from 'lucide-react';
import { Post, Comment } from '../types';

interface ShortsFeedProps {
  posts: Post[];
  currentUserAvatar: string;
  onLike: (postId: string) => void;
  onDislike: (postId: string) => void;
  onSave: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  followedCreators: string[];
  toggleFollowCreator: (username: string) => void;
  savedPostIds: string[];
}

export default function ShortsFeed({
  posts,
  currentUserAvatar,
  onLike,
  onDislike,
  onSave,
  onAddComment,
  followedCreators,
  toggleFollowCreator,
  savedPostIds
}: ShortsFeedProps) {
  // Only use posts of type 'short'
  const shorts = posts.filter(post => post.type === 'short');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeShort = shorts[currentIdx];

  useEffect(() => {
    // Autoplay active short when index changes
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play().catch(err => {
          console.log("Autoplay blocked:", err);
          setIsPlaying(false);
        });
      }
    }
  }, [currentIdx]);

  if (shorts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-zinc-500 font-medium">No Shorts published yet.</p>
      </div>
    );
  }

  const handleNext = () => {
    if (currentIdx < shorts.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setShowComments(false);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setShowComments(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    try {
      navigator.clipboard.writeText(`${window.location.origin}/short/${activeShort.id}`);
    } catch (_) {}
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(activeShort.id, commentInput.trim());
    setCommentInput('');
  };

  const isFollowed = followedCreators.includes(activeShort.author);
  const isSaved = savedPostIds.includes(activeShort.id);

  return (
    <div id="shorts-immersive-feed" className="w-full max-w-md mx-auto py-2 px-4 flex flex-col items-center">
      
      {/* Quick Indicator heading */}
      <div className="w-full flex items-center justify-between mb-3 text-zinc-400 select-none">
        <span className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 bg-red-600/10 text-red-400 px-2.5 py-1 rounded-full border border-red-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          Shorts Mode
        </span>
        <span className="text-xs font-mono font-semibold">
          {currentIdx + 1} of {shorts.length}
        </span>
      </div>

      {/* Main vertical viewer frame */}
      <div className="relative w-full aspect-[9/16] bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
        
        {/* Full Viewport Video Tag */}
        <video
          ref={videoRef}
          src={activeShort.mediaUrl}
          loop
          muted={isMuted}
          playsInline
          autoPlay
          onClick={togglePlay}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer z-0"
        />

        {/* Top Floating bar (Sound and Play Indicators) */}
        <div className="relative z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
          <button
            onClick={togglePlay}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-all cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4.5 h-4.5 fill-current" /> : <Play className="w-4.5 h-4.5 fill-current" />}
          </button>

          <button
            onClick={toggleMute}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-all cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
          </button>
        </div>

        {/* Navigation Action Buttons Left / Right margins (Desktop helpers for ease of browsing) */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="p-2.5 rounded-full bg-zinc-950/80 border border-zinc-800/80 text-zinc-300 disabled:opacity-20 hover:text-white transition-all cursor-pointer focus:outline-none"
          >
            <ChevronUp className="w-5.5 h-5.5" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIdx === shorts.length - 1}
            className="p-2.5 rounded-full bg-zinc-950/80 border border-zinc-800/80 text-zinc-300 disabled:opacity-20 hover:text-white transition-all cursor-pointer focus:outline-none"
          >
            <ChevronDown className="w-5.5 h-5.5" />
          </button>
        </div>

        {/* Main Side Widgets Bar (Right side overlays like TikTok/Instagram Reels) */}
        <div className="absolute right-4 bottom-24 flex flex-col items-center gap-5 z-10 select-none">
          
          {/* Creator Avatar with follow overlay button */}
          <div className="relative pb-2">
            <img
              src={activeShort.authorAvatar}
              alt={activeShort.author}
              className="w-12 h-12 rounded-full object-cover border-2 border-red-500 shadow-lg"
            />
            <button
              onClick={() => toggleFollowCreator(activeShort.author)}
              className={`absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full transition-all ${
                isFollowed 
                  ? 'bg-zinc-800 text-zinc-300' 
                  : 'bg-red-550 text-white hover:bg-red-650'
              }`}
            >
              {isFollowed ? '✓' : '+'}
            </button>
          </div>

          {/* Likes Widget */}
          <button
            onClick={() => onLike(activeShort.id)}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className={`p-3 rounded-full bg-black/40 backdrop-blur-md border border-zinc-800/30 transition-transform duration-300 group-hover:scale-110 ${
              activeShort.hasLiked ? 'text-red-500 bg-red-500/10' : 'text-white'
            }`}>
              <Heart className={`w-5.5 h-5.5 ${activeShort.hasLiked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[10px] font-mono font-bold text-zinc-100 shadow-sm leading-none">
              {activeShort.likes}
            </span>
          </button>

          {/* Comment Drawer Activation Widget */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-zinc-800/30 transition-transform duration-300 group-hover:scale-110 text-white">
              <MessageCircle className="w-5.5 h-5.5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-zinc-100 shadow-sm leading-none">
              {activeShort.comments.length}
            </span>
          </button>

          {/* Bookmarks Widget */}
          <button
            onClick={() => onSave(activeShort.id)}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className={`p-3 rounded-full bg-black/40 backdrop-blur-md border border-zinc-800/30 transition-transform duration-300 group-hover:scale-110 ${
              isSaved ? 'text-yellow-500 bg-yellow-500/10' : 'text-white'
            }`}>
              <Bookmark className={`w-5.5 h-5.5 ${isSaved ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[10px] font-mono font-bold text-zinc-400">Save</span>
          </button>

          {/* Share widget */}
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-zinc-800/30 transition-transform duration-300 group-hover:scale-110 text-white">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-zinc-400">Share</span>
          </button>
        </div>

        {/* Bottom Metadata descriptions Overlay */}
        <div className="relative z-10 p-5 bg-gradient-to-t from-black/95 via-black/50 to-transparent pt-12 text-white">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="font-bold text-sm text-zinc-100 italic">@{activeShort.author}</span>
            {isFollowed && (
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest bg-red-500/15 border border-red-500/20 px-2 py-0.5 rounded-full">
                Following
              </span>
            )}
          </div>

          <p className="text-xs text-zinc-200 line-clamp-2 leading-relaxed mb-3 font-normal font-sans">
            {activeShort.title} — {activeShort.description}
          </p>

          {/* Simple animated music loop visual */}
          <div className="flex items-center gap-2 text-zinc-400 text-[10px]">
            <Music className="w-3.5 h-3.5 text-red-505" />
            <span className="truncate w-48 font-medium">Original Audio • {activeShort.author}</span>
          </div>
        </div>

        {/* Quick Swipe instruction line */}
        <div className="absolute inset-x-0 bottom-1.5 text-center pointer-events-none z-10">
          <span className="inline-block w-8 h-1 bg-white/20 rounded-full animate-pulse" />
        </div>

        {/* Dynamic sliding Comments Panel Overlay inside Short chassis! */}
        {showComments && (
          <div className="absolute inset-x-0 bottom-0 top-1/3 bg-zinc-950/95 backdrop-blur-md rounded-t-3xl border-t border-zinc-800 z-20 flex flex-col">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-zinc-850 flex items-center justify-between">
              <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-red-500" />
                Comments ({activeShort.comments.length})
              </h4>
              <button
                onClick={() => setShowComments(false)}
                className="text-zinc-400 hover:text-white font-bold text-sm hover:scale-105"
              >
                ✕
              </button>
            </div>

            {/* List Of Comments */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
              {activeShort.comments.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center italic py-12">No comments yet. Start the conversation!</p>
              ) : (
                activeShort.comments.map(c => (
                  <div key={c.id} className="flex gap-2.5 items-start">
                    <img
                      src={c.authorAvatar}
                      alt={c.author}
                      className="w-7 h-7 rounded-full object-cover border border-zinc-850"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex justify-between">
                        <span className="font-bold text-zinc-200">@{c.author}</span>
                        <span className="text-[9px] text-zinc-500 font-mono">{c.timestamp}</span>
                      </div>
                      <p className="text-zinc-300 mt-0.5 leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Input Form */}
            <form onSubmit={handleAddCommentSubmit} className="p-3 border-t border-zinc-850 bg-zinc-950 flex gap-2">
              <input
                type="text"
                placeholder="Write comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-801 rounded-xl px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-400"
              />
              <button
                type="submit"
                className="bg-red-650 hover:bg-red-750 text-white font-bold text-xs px-3.5 rounded-xl transition-colors cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        )}

        {/* Share copying Link Success overlay inside visual display frame */}
        {copiedLink && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-red-650 text-white text-[11px] font-semibold tracking-wide px-3.5 py-1.5 rounded-full z-30 shadow-2xl border border-red-500 animate-fade-in">
            Short Link copied!
          </div>
        )}
      </div>
    </div>
  );
}
