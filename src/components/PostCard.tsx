import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, MessageCircle, Send, Bookmark, Play, Pause, Volume2, VolumeX,
  ThumbsUp, ThumbsDown, User, MapPin, MoreHorizontal, MessageSquare, Check, Eye
} from 'lucide-react';
import { Post, Comment } from '../types';

interface PostCardProps {
  post: Post;
  currentUsername: string;
  currentUserAvatar: string;
  onLike: (postId: string) => void;
  onDislike: (postId: string) => void;
  onSave: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onAuthorClick: (authorUsername: string) => void;
  onTagClick: (tag: string) => void;
  isSaved: boolean;
  isFollowed?: boolean;
  onFollowToggle?: () => void;
  isSubscribed?: boolean;
  onSubscribeToggle?: () => void;
}

export default function PostCard({
  post,
  currentUsername,
  currentUserAvatar,
  onLike,
  onDislike,
  onSave,
  onAddComment,
  onAuthorClick,
  onTagClick,
  isSaved,
  isFollowed = false,
  onFollowToggle,
  isSubscribed = false,
  onSubscribeToggle
}: PostCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [shareToast, setShareToast] = useState(false);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  let lastTapRef = useRef<number | null>(null);

  // Manage custom video progress bar
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        setVideoProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [post.type]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(e => console.log("Auto-play error:", e));
        setIsPlaying(true);
      }
    }
  };

  const handleMuteUnmute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleDoubleTapLike = () => {
    // Animate large absolute heartbeat icon
    setShowHeartOverlay(true);
    setTimeout(() => setShowHeartOverlay(false), 800);
    if (!post.hasLiked) {
      onLike(post.id);
    }
  };

  const handleCardDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTapRef.current && (now - lastTapRef.current) < DOUBLE_PRESS_DELAY) {
      handleDoubleTapLike();
    }
    lastTapRef.current = now;
  };

  const triggerShare = () => {
    setShareToast(true);
    // Simulate clipboard copy safely in iframe
    try {
      const shareUrl = `${window.location.origin}/post/${post.id}`;
      navigator.clipboard.writeText(shareUrl);
    } catch (e) {
      // safe fallback
    }
    setTimeout(() => setShareToast(false), 2500);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput.trim());
    setCommentInput('');
    setShowComments(true);
  };

  // Helper to parse the caption text and wrap #hashtags in interactive buttons
  const renderCaptionWithHashtags = (text: string) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        const cleanedTag = part.replace(/[#,.:;!?]/g, '');
        return (
          <button
            key={index}
            onClick={() => onTagClick(cleanedTag)}
            className="text-red-400 hover:text-red-300 hover:underline font-semibold cursor-pointer mr-1"
          >
            {part}
          </button>
        );
      }
      return part;
    });
  };

  return (
    <article className="w-full bg-zinc-900/50 border border-zinc-800/80 rounded-2xl overflow-hidden mb-6 group transition-all duration-300 hover:border-zinc-700/60 shadow-lg relative">
      
      {/* 1. Header Area: Instagram styling with YouTube style verified tags */}
      <div className="flex items-center justify-between p-4 bg-zinc-950/20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onAuthorClick(post.author)}
            className="relative cursor-pointer focus:outline-none"
          >
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-red-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <img
              src={post.authorAvatar}
              alt={post.author}
              className="relative w-10 h-10 rounded-full object-cover border border-zinc-800"
            />
          </button>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => onAuthorClick(post.author)}
                className="text-sm font-bold text-zinc-100 hover:text-red-400 transition-colors cursor-pointer text-left focus:outline-none"
              >
                {post.author}
              </button>
              {post.authorFollowers > 100000 && (
                <span className="w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white mr-1 shadow-sm">
                  ✓
                </span>
              )}

              {currentUsername !== post.author && (
                <div className="flex items-center gap-1 ml-1 select-none">
                  {/* Inline Follow pill */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onFollowToggle?.(); }}
                    className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full transition-all cursor-pointer border ${
                      isFollowed
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-400'
                        : 'bg-blue-600/15 border-blue-500/25 text-blue-400 hover:bg-blue-600/30'
                    }`}
                  >
                    {isFollowed ? 'Following' : '+ Follow'}
                  </button>

                  {/* Inline Subscribe pill */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onSubscribeToggle?.(); }}
                    className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full transition-all cursor-pointer border flex items-center gap-1 ${
                      isSubscribed
                        ? 'bg-red-950/45 border-red-900/30 text-red-400'
                        : 'bg-red-600/15 border-red-500/25 text-red-500 hover:bg-red-650/30'
                    }`}
                  >
                    <Play className="w-1.5 h-1.5 fill-current shrink-0" />
                    <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
                  </button>
                </div>
              )}
            </div>
            
            {post.location && (
              <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-0.5 mt-0.5">
                <MapPin className="w-3 h-3 text-red-500" />
                {post.location}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-medium">{post.timestamp}</span>
          <button className="p-1.5 hover:bg-zinc-800/80 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Media Area: Visual Double-tap Trigger */}
      <div 
        onClick={handleCardDoubleTap}
        className="relative w-full overflow-hidden bg-black flex items-center justify-center"
      >
        {post.type === 'video' ? (
          <div className="relative w-full aspect-video group/video select-none">
            <video
              ref={videoRef}
              src={post.mediaUrl}
              loop
              muted={isMuted}
              playsInline
              onClick={handlePlayPause}
              className="w-full h-full object-cover cursor-pointer"
            />
            {/* Thumbnail Poster Image shown if not played */}
            {!isPlaying && post.thumbnailUrl && (
              <img
                src={post.thumbnailUrl}
                alt="Video poster"
                onClick={handlePlayPause}
                className="absolute inset-0 w-full h-full object-cover cursor-pointer hover:scale-101 transition-transform duration-700"
              />
            )}

            {/* Video Controls overlay layout */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-100 md:opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none">
              
              {/* Duration metadata bubble */}
              <div className="flex justify-end">
                {post.duration && (
                  <span className="font-mono text-[10px] font-bold bg-black/80 tracking-wider text-zinc-200 px-2 py-1 rounded-md">
                    {post.duration}
                  </span>
                )}
              </div>

              {/* Large Centered Play Trigger overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handlePlayPause(); }}
                  className="p-4 rounded-full bg-red-600/90 text-white pointer-events-auto hover:scale-110 active:scale-95 transition-all shadow-xl shadow-red-600/20"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-white" />
                  ) : (
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  )}
                </button>
              </div>

              {/* Interactive Video controls timeline list */}
              <div className="w-full flex items-center justify-between gap-4 mt-auto pointer-events-auto pt-4">
                {/* Visual custom progress bar */}
                <div className="flex-1 h-1 bg-zinc-850 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-red-500 rounded-full" 
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>

                {/* Speaker Toggle */}
                <button
                  onClick={handleMuteUnmute}
                  className="p-1.5 rounded-lg bg-black/50 hover:bg-black/80 backdrop-blur-md text-white transition-all cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-zinc-300" /> : <Volume2 className="w-4 h-4 text-white" />}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full aspect-[4/3] bg-zinc-950">
            <img
              src={post.mediaUrl}
              alt={post.title}
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          </div>
        )}

        {/* Dynamic large double-tap heartbeat overlay popup */}
        {showHeartOverlay && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none z-10">
            <div className="p-6 bg-white/15 backdrop-blur-md rounded-full shadow-2xl animate-ping-once">
              <Heart className="w-16 h-16 fill-red-500 text-red-500" />
            </div>
          </div>
        )}
      </div>

      {/* 3. Action Toolbar: Combined YouTube layout and Instagram layout */}
      <div className="p-4 pb-2 border-b border-zinc-850">
        <div className="flex items-center justify-between mb-3.5">
          {/* Reaction Block */}
          <div className="flex items-center gap-2">
            {/* Instagram Heart Like button */}
            <button
              onClick={() => onLike(post.id)}
              className={`p-2 rounded-xl transition-all ${
                post.hasLiked 
                  ? 'bg-red-500/10 text-red-500 scale-105' 
                  : 'hover:bg-zinc-850 text-zinc-300 hover:text-red-500'
              }`}
            >
              <Heart className={`w-6 h-6 ${post.hasLiked ? 'fill-current' : ''}`} />
            </button>

            {/* YouTube Dislike button */}
            <button
              onClick={() => onDislike(post.id)}
              className={`p-2 rounded-xl transition-all ${
                post.hasDisliked
                  ? 'bg-blue-500/10 text-blue-500'
                  : 'hover:bg-zinc-850 text-zinc-300 hover:text-blue-500'
              }`}
            >
              <ThumbsDown className={`w-5 h-5 ${post.hasDisliked ? 'fill-current' : ''}`} />
            </button>

            {/* Comment Drawer button */}
            <button
              onClick={() => setShowComments(!showComments)}
              className={`p-2 rounded-xl hover:bg-zinc-850 text-zinc-300 hover:text-zinc-100 transition-all ${
                showComments ? 'bg-zinc-800 text-white' : ''
              }`}
            >
              <MessageCircle className="w-6 h-6" />
            </button>

            {/* Share button */}
            <button
              onClick={triggerShare}
              className="p-2 rounded-xl hover:bg-zinc-850 text-zinc-300 hover:text-zinc-100 transition-all"
            >
              <Send className="w-5.5 h-5.5" />
            </button>
          </div>

          {/* Instagram bookmark to Profile */}
          <button
            onClick={() => onSave(post.id)}
            className={`p-2 rounded-xl transition-all ${
              isSaved
                ? 'bg-yellow-500/10 text-yellow-500'
                : 'hover:bg-zinc-850 text-zinc-300 hover:text-yellow-500'
            }`}
          >
            <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Statistics readouts */}
        <div className="flex items-center gap-4.5 text-xs font-mono font-semibold text-zinc-400 mb-2">
          {post.type === 'video' && (
            <span className="flex items-center gap-1 font-medium select-none bg-zinc-850/60 px-2 py-1 rounded-md text-[11px] text-zinc-300">
              <Eye className="w-3.5 h-3.5 text-zinc-400" />
              {post.views.toLocaleString()} views
            </span>
          )}
          
          <span className="flex items-center gap-1 bg-zinc-850/60 px-2 py-1 rounded-md text-[11px] text-zinc-300 font-medium">
            <ThumbsUp className="w-3.5 h-3.5 text-red-400 fill-current" />
            {post.likes.toLocaleString()} likes
          </span>

          {post.dislikes !== undefined && post.dislikes > 0 && (
            <span className="text-[11px] font-mono font-medium text-zinc-500">
              {post.dislikes} dislikes
            </span>
          )}
        </div>

        {/* 4. Captions & Hashtags */}
        <div className="space-y-1.5 mt-2">
          <p className="text-sm font-semibold tracking-tight text-zinc-100 leading-snug">
            {post.title}
          </p>
          <div className="text-zinc-300 text-xs md:text-sm leading-relaxed mt-1 whitespace-pre-line font-normal font-sans">
            <span className="font-bold text-zinc-100 mr-2 hover:text-red-400 cursor-pointer" onClick={() => onAuthorClick(post.author)}>
              {post.author}
            </span>
            {renderCaptionWithHashtags(post.description)}
          </div>
        </div>

        {/* Collapsed comments status count preview button */}
        {post.comments.length > 0 && !showComments && (
          <button
            onClick={() => setShowComments(true)}
            className="text-xs font-bold text-red-400/85 hover:text-red-450 mt-3 flex items-center gap-1.5 focus:outline-none cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            View all {post.comments.length} comments
          </button>
        )}
      </div>

      {/* 5. Interactive Comments Grid & Panel */}
      {showComments && (
        <div className="bg-zinc-950/40 px-4 py-3 border-b border-zinc-850 max-h-72 overflow-y-auto no-scrollbar">
          <div className="space-y-3.5">
            {post.comments.length === 0 ? (
              <p className="text-xs text-zinc-500 py-3 text-center italic">Be the first to share your thoughts!</p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 text-xs md:text-sm text-zinc-150 items-start group/comment">
                  <button onClick={() => onAuthorClick(comment.author)} className="flex-shrink-0 cursor-pointer">
                    <img
                      src={comment.authorAvatar}
                      alt={comment.author}
                      className="w-8 h-8 rounded-full object-cover border border-zinc-800"
                    />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <button
                        onClick={() => onAuthorClick(comment.author)}
                        className="font-bold text-zinc-200 hover:text-red-400 focus:outline-none"
                      >
                        {comment.author}
                      </button>
                      <span className="text-[10px] text-zinc-500 font-mono">{comment.timestamp}</span>
                    </div>
                    <p className="text-zinc-300 leading-normal">{comment.text}</p>
                  </div>
                  
                  {/* Heart button on comments */}
                  <button className="text-zinc-600 hover:text-red-500 transition-colors p-1 flex-shrink-0">
                    <Heart className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 6. Comment Form Input Area */}
      <form onSubmit={handleSubmitComment} className="flex items-center bg-zinc-950/20 px-4 py-3 gap-3">
        <img
          src={currentUserAvatar}
          alt="My avatar"
          className="w-8 h-8 rounded-full object-cover border border-zinc-800 hidden sm:block"
        />
        <div className="flex-1 flex items-center relative bg-zinc-950 border border-zinc-801 rounded-xl px-4 py-2 hover:border-zinc-700 transition-colors">
          <input
            type="text"
            placeholder="Add dynamic comment..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="flex-1 bg-transparent text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none outline-none pr-8 font-sans"
          />
          <button
            type="submit"
            disabled={!commentInput.trim()}
            className="absolute right-3.5 text-xs font-bold text-red-505 hover:text-red-405 disabled:text-zinc-600 disabled:hover:text-zinc-600 transition-colors cursor-pointer"
          >
            Post
          </button>
        </div>
      </form>

      {/* Share Toast Alerts overlay inside card */}
      {shareToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-650 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 z-30 border border-red-500 animate-fade-in animate-pulse">
          <Check className="w-3.5 h-3.5 text-white" />
          <span>Post link copied safely!</span>
        </div>
      )}

      {/* Heartbeat Animation CSS */}
      <style>{`
        @keyframes pingOnce {
          o% { transform: scale(0.6); opacity: 0; }
          50% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        .animate-ping-once {
          animation: pingOnce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </article>
  );
}
