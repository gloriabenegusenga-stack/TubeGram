import { useState } from 'react';
import { Grid, Play, Bookmark, Globe, MessageSquare, Edit3, Check, Heart, Eye } from 'lucide-react';
import { Post, UserProfile } from '../types';

interface UserProfileViewProps {
  profile: UserProfile;
  posts: Post[];
  savedPostIds: string[];
  followedCreators: string[];
  toggleFollowCreator: (username: string) => void;
  subscribedCreators: string[];
  toggleSubscribeCreator: (username: string) => void;
  onPostClick: (postId: string) => void;
  isCurrentUser: boolean;
  onUpdateBio?: (newBio: string) => void;
}

export default function UserProfileView({
  profile,
  posts,
  savedPostIds,
  followedCreators,
  toggleFollowCreator,
  subscribedCreators = [],
  toggleSubscribeCreator,
  onPostClick,
  isCurrentUser,
  onUpdateBio
}: UserProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'grid' | 'video' | 'saved'>('grid');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(profile.bio);

  // Filter posts based on ownership
  const authorPosts = posts.filter(post => post.author === profile.username);
  
  // Saved posts filter
  const savedPosts = posts.filter(post => savedPostIds.includes(post.id));

  // Video posts specifically (by type)
  const videoPosts = authorPosts.filter(post => post.type === 'video');

  const isFollowed = followedCreators.includes(profile.username);
  const displayFollowers = profile.followers + (isFollowed ? 1 : 0);

  const isSubscribed = subscribedCreators.includes(profile.username);
  const displaySubscribers = Math.round(profile.followers * 1.83) + (isSubscribed ? 1 : 0);

  const handleSaveBio = () => {
    if (onUpdateBio) {
      onUpdateBio(bioInput);
    }
    setIsEditingBio(false);
  };

  return (
    <div id="user-profile-view" className="w-full max-w-4xl mx-auto px-4 py-6 pb-24">
      {/* Profile Header Card */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-left">
          {/* Avatar Ring */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-red-600 via-pink-500 to-yellow-500 animate-pulse-slow opacity-60" />
            <img
              src={profile.avatar}
              alt={profile.name}
              className="relative w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-zinc-950"
            />
          </div>

          <div className="flex-1">
            {/* Name/Username + Actions Row */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">{profile.name}</h1>
                {profile.verified && (
                  <span className="bg-blue-500 text-white rounded-full p-0.5" title="Verified Creator">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <span className="text-sm text-zinc-400 font-mono">@{profile.username}</span>
            </div>
            
            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-2.5 justify-center md:justify-start mb-4">
              {isCurrentUser ? (
                <button
                  onClick={() => {
                    setIsEditingBio(!isEditingBio);
                    if (!isEditingBio) setBioInput(profile.bio);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-100 transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  {isEditingBio ? "Cancel" : "Edit Bio"}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {/* Follow Button */}
                  <button
                    onClick={() => toggleFollowCreator(profile.username)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-300 ${
                      isFollowed
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                    }`}
                  >
                    {isFollowed ? 'Following' : 'Follow'}
                  </button>

                  {/* Subscribe Button (YouTube TubeGram themed) */}
                  <button
                    onClick={() => toggleSubscribeCreator(profile.username)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-300 flex items-center gap-1.5 ${
                      isSubscribed
                        ? 'bg-red-950/40 hover:bg-red-900/30 text-red-400 border border-red-900/40'
                        : 'bg-red-650 hover:bg-red-755 text-white shadow-md'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current shrink-0" />
                    <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Profile Statistics metrics with 4 high density items */}
            <div className="grid grid-cols-4 gap-2 max-w-md mx-auto md:mx-0 p-3 bg-zinc-950/40 rounded-xl border border-zinc-805 mb-4 text-center">
              <div>
                <p className="text-xs md:text-sm font-extrabold text-zinc-100 font-mono">{authorPosts.length}</p>
                <p className="text-[9px] uppercase text-zinc-500 tracking-wider font-semibold">Posts</p>
              </div>
              <div>
                <p className="text-xs md:text-sm font-extrabold text-zinc-100 font-mono">
                  {(displayFollowers >= 1000) ? `${(displayFollowers / 1000).toFixed(1)}k` : displayFollowers}
                </p>
                <p className="text-[9px] uppercase text-zinc-500 tracking-wider font-semibold">Followers</p>
              </div>
              <div>
                <p className="text-xs md:text-sm font-extrabold text-zinc-100 font-mono">
                  {(displaySubscribers >= 1000) ? `${(displaySubscribers / 1000).toFixed(1)}k` : displaySubscribers}
                </p>
                <p className="text-[9px] uppercase text-zinc-500 tracking-wider font-semibold">Subscribers</p>
              </div>
              <div>
                <p className="text-xs md:text-sm font-extrabold text-zinc-100 font-mono">{profile.following}</p>
                <p className="text-[9px] uppercase text-zinc-500 tracking-wider font-semibold font-sans">Following</p>
              </div>
            </div>

            {/* Editable biography */}
            {isEditingBio ? (
              <div className="space-y-2 mt-2">
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-red-500 text-zinc-100 text-sm focus:outline-none placeholder-zinc-600 font-sans"
                  rows={3}
                  maxLength={180}
                  placeholder="Tell your custom journey story..."
                />
                <button
                  onClick={handleSaveBio}
                  className="px-4 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            ) : (
              <p className="text-sm text-zinc-300 leading-relaxed font-sans max-w-lg mt-2">
                {profile.bio || "No biography details shared yet."}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs selectors: Instagram Grid, YouTube Video List, Saved Books */}
      <div className="flex border-b border-zinc-800 mb-6 font-medium text-sm text-center">
        <button
          onClick={() => setActiveTab('grid')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors relative border-b-2 font-semibold ${
            activeTab === 'grid'
              ? 'text-white border-red-500'
              : 'text-zinc-500 hover:text-zinc-300 border-transparent'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Grid Feed</span>
        </button>

        <button
          onClick={() => setActiveTab('video')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors relative border-b-2 font-semibold ${
            activeTab === 'video'
              ? 'text-white border-red-500'
              : 'text-zinc-500 hover:text-zinc-300 border-transparent'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Videos ({videoPosts.length})</span>
        </button>

        {isCurrentUser && (
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors relative border-b-2 font-semibold ${
              activeTab === 'saved'
                ? 'text-white border-red-500'
                : 'text-zinc-500 hover:text-zinc-300 border-transparent'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved ({savedPosts.length})</span>
          </button>
        )}
      </div>

      {/* Display Grid Feed Area */}
      {activeTab === 'grid' && (
        <>
          {authorPosts.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900/20 rounded-2xl border border-zinc-800 border-dashed">
              <Grid className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 font-semibold mb-1">No Posts Yet</p>
              <p className="text-zinc-500 text-xs">Share your moments or creations publicly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5 md:gap-4">
              {authorPosts.map(post => (
                <div
                  key={post.id}
                  onClick={() => onPostClick(post.id)}
                  className="group relative aspect-square rounded-xl bg-zinc-900 overflow-hidden cursor-pointer border border-zinc-800/50"
                >
                  <img
                    src={post.type === 'video' ? (post.thumbnailUrl || post.mediaUrl) : post.mediaUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Indicator icons depending on type */}
                  <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md p-1.5 rounded-lg text-white">
                    {post.type === 'video' ? <Play className="w-3.5 h-3.5 fill-white" /> : <Globe className="w-3.5 h-3.5" />}
                  </div>

                  {/* Hover Meta overlays (Instagram-style hover overlay) */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-white font-bold text-sm">
                    <span className="flex items-center gap-1">
                      <Heart className="w-5 h-5 fill-white" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-5 h-5 fill-white" />
                      {post.comments.length}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Display Video Specific List Area (YouTube design) */}
      {activeTab === 'video' && (
        <>
          {videoPosts.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900/20 rounded-2xl border border-zinc-800 border-dashed">
              <Play className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 font-semibold mb-1">No Videos Uploaded</p>
              <p className="text-zinc-500 text-xs">Film and share landscape or tutorial videos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {videoPosts.map(post => (
                <div
                  key={post.id}
                  onClick={() => onPostClick(post.id)}
                  className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl overflow-hidden cursor-pointer hover:bg-zinc-900/60 transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-video w-full bg-black">
                    <img
                      src={post.thumbnailUrl || post.mediaUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Duration badge */}
                    {post.duration && (
                      <span className="absolute bottom-2.5 right-2 text-[10px] bg-black/85 font-semibold font-mono tracking-wider text-zinc-200 px-2 py-0.5 rounded-md">
                        {post.duration}
                      </span>
                    )}
                    {/* Floating play visual */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                      <div className="w-12 h-12 rounded-full bg-red-650 flex items-center justify-center shadow-lg shadow-red-650/30">
                        <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-zinc-100 tracking-tight line-clamp-1 mb-1 hover:text-red-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-xs text-zinc-400 font-medium line-clamp-2 leading-relaxed">
                        {post.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3.5 mt-3 pt-2 border-t border-zinc-850/60 text-[11px] font-mono font-medium text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-zinc-550" />
                        {post.views.toLocaleString()} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        {post.likes} likes
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Saved Bookmarks Section (Instagram concept) */}
      {activeTab === 'saved' && isCurrentUser && (
        <>
          {savedPosts.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900/20 rounded-2xl border border-zinc-800 border-dashed">
              <Bookmark className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 font-semibold mb-1">No Saved Posts</p>
              <p className="text-zinc-500 text-xs">Bookmark posts you find interesting to view them later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5 md:gap-4">
              {savedPosts.map(post => (
                <div
                  key={post.id}
                  onClick={() => onPostClick(post.id)}
                  className="group relative aspect-square rounded-xl bg-zinc-900 overflow-hidden cursor-pointer border border-zinc-800/50"
                >
                  <img
                    src={post.type === 'video' ? (post.thumbnailUrl || post.mediaUrl) : post.mediaUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md p-1.5 rounded-lg text-white text-xs">
                    {post.type === 'video' ? 'Video' : 'Photo'}
                  </div>

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-white font-bold text-sm">
                    <span className="flex items-center gap-1">
                      <Heart className="w-5 h-5 fill-white" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-5 h-5 fill-white" />
                      {post.comments.length}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
