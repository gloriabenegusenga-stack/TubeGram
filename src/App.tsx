import { useState, useMemo } from 'react';
import { INITIAL_POSTS, INITIAL_STORIES, INITIAL_USER } from './data';
import { Post, Story, UserProfile } from './types';
import Navigation from './components/Navigation';
import StoriesBar from './components/StoriesBar';
import Header from './components/Header';
import PostCard from './components/PostCard';
import ShortsFeed from './components/ShortsFeed';
import CreatePostModal from './components/CreatePostModal';
import UserProfileView from './components/UserProfileView';
import LoginScreen from './components/LoginScreen';
import { Heart, Search, Film, Globe, Grid, Play, AlertCircle, Compass, Camera, Sparkles, Check, ChevronLeft } from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);
  const [savedPostIds, setSavedPostIds] = useState<string[]>(['p2', 'p4']);
  const [followedCreators, setFollowedCreators] = useState<string[]>(['clara_travels']);
  const [subscribedCreators, setSubscribedCreators] = useState<string[]>(['clara_travels']);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTagFilter, setActiveTagFilter] = useState('');
  
  // To view other creators profiles in-app
  const [viewingCreatorUsername, setViewingCreatorUsername] = useState<string | null>(null);

  // Dynamic success toast state
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Follow/Unfollow toggle
  const toggleFollowCreator = (username: string) => {
    setFollowedCreators(prev => {
      if (prev.includes(username)) {
        return prev.filter(name => name !== username);
      } else {
        return [...prev, username];
      }
    });
  };

  // Subscribe/Unsubscribe toggle
  const toggleSubscribeCreator = (username: string) => {
    setSubscribedCreators(prev => {
      if (prev.includes(username)) {
        return prev.filter(name => name !== username);
      } else {
        return [...prev, username];
      }
    });
  };

  // Like operations toggles (YouTube and Instagram mix)
  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const isLiked = post.hasLiked;
          const nextLiked = !isLiked;
          return {
            ...post,
            likes: nextLiked ? post.likes + 1 : post.likes - 1,
            hasLiked: nextLiked,
            // Untoggle dislike if liked
            dislikes: (post.hasDisliked && nextLiked) ? post.dislikes - 1 : post.dislikes,
            hasDisliked: nextLiked ? false : post.hasDisliked
          };
        }
        return post;
      })
    );
  };

  const handleDislike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const isDisliked = post.hasDisliked;
          const nextDisliked = !isDisliked;
          return {
            ...post,
            dislikes: nextDisliked ? post.dislikes + 1 : post.dislikes - 1,
            hasDisliked: nextDisliked,
            // Untoggle like if disliked
            likes: (post.hasLiked && nextDisliked) ? post.likes - 1 : post.likes,
            hasLiked: nextDisliked ? false : post.hasLiked
          };
        }
        return post;
      })
    );
  };

  // Save/Bookmark toggles
  const handleSave = (postId: string) => {
    setSavedPostIds(prev => {
      if (prev.includes(postId)) {
        return prev.filter(id => id !== postId);
      } else {
        return [...prev, postId];
      }
    });
  };

  // Add Comment System
  const handleAddComment = (postId: string, commentText: string) => {
    const newComment = {
      id: `c_${Date.now()}`,
      author: currentUser.username,
      authorAvatar: currentUser.avatar,
      text: commentText,
      timestamp: "Just now",
      likes: 0
    };

    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [newComment, ...post.comments]
          };
        }
        return post;
      })
    );
  };

  // Profile resolution from username list
  const findProfileByUsername = (username: string): UserProfile => {
    if (username === currentUser.username) {
      return currentUser;
    }
    // Search the existing posts for their author card metadata details
    const authorPost = posts.find(p => p.author === username);
    return {
      name: authorPost ? authorPost.author.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : username,
      username: username,
      avatar: authorPost ? authorPost.authorAvatar : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      bio: authorPost ? `Creator specializing in #photography and visual arts. Join my journey as we travel the frontiers of storytelling and aesthetics!` : `Curated visual feed celebrating #minimalism, landscapes, and modern lifestyle setups. Fully interactive content player.`,
      followers: authorPost ? authorPost.authorFollowers : 24300,
      following: 142,
      postsCount: posts.filter(p => p.author === username).length,
      verified: authorPost ? authorPost.authorFollowers > 100000 : false
    };
  };

  const handleAuthorClick = (authorUsername: string) => {
    if (authorUsername === currentUser.username) {
      setViewingCreatorUsername(null);
    } else {
      setViewingCreatorUsername(authorUsername);
    }
    setActiveTab('profile');
    // Scroll profile view back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublishPost = (newPostData: Omit<Post, 'id' | 'likes' | 'dislikes' | 'views' | 'comments' | 'timestamp' | 'hasLiked' | 'hasDisliked' | 'hasSaved'>) => {
    const freshPost: Post = {
      id: `p_${Date.now()}`,
      likes: 0,
      dislikes: 0,
      views: newPostData.type === 'photo' ? 0 : Math.floor(Math.random() * 50) + 1,
      comments: [],
      timestamp: "Just now",
      ...newPostData
    };

    setPosts(prev => [freshPost, ...prev]);
    setIsCreateOpen(false);
    
    // Add dynamic success notification
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 3000);
    
    // Auto redirect back to Feed to see the post instantly!
    setActiveTab('feed');
  };

  const handleUpdateBio = (newBio: string) => {
    setCurrentUser(prev => ({ ...prev, bio: newBio }));
  };

  const handleProfilePostClick = (postId: string) => {
    // Take user back to Combined feed and scroll them straight to the post!
    setActiveTab('feed');
    // Fast timeout for DOM loading then scroll
    setTimeout(() => {
      const el = document.getElementById(`post-card-${postId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Searching indexer & Combined Filter Logic
  // Matches title, description, location, tags, authors
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // 1. Tag filtering from header pills
      if (activeTagFilter && !post.tags.includes(activeTagFilter)) {
        return false;
      }

      // 2. Query search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = post.title.toLowerCase().includes(query);
        const matchDesc = post.description.toLowerCase().includes(query);
        const matchAuthor = post.author.toLowerCase().includes(query);
        const matchLoc = post.location ? post.location.toLowerCase().includes(query) : false;
        const matchTags = post.tags.some(tag => tag.toLowerCase().includes(query));

        return matchTitle || matchDesc || matchAuthor || matchLoc || matchTags;
      }

      return true;
    });
  }, [posts, searchQuery, activeTagFilter]);

  // Split standard combined feed posts (type: photo or video)
  const feedPosts = filteredPosts.filter(post => post.type === 'video' || post.type === 'photo');

  // Currently resolved profile to view
  const currentlyBrowsedProfile = viewingCreatorUsername 
    ? findProfileByUsername(viewingCreatorUsername) 
    : currentUser;

  if (!isLoggedIn) {
    return (
      <LoginScreen 
        onLoginSuccess={(userData) => {
          setCurrentUser({
            name: userData.name,
            username: userData.username,
            avatar: userData.avatar,
            bio: userData.bio,
            followers: 1240,
            following: 250,
            postsCount: posts.filter(p => p.author === userData.username).length,
            verified: false
          });
          setIsLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row antialiased select-none font-sans">
      
      {/* 2-Way Native Sidebar Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={(tab) => {
          // If moving between main headers, clear secondary viewing profiles to maintain solid UX
          if (tab !== 'profile') {
            setViewingCreatorUsername(null);
          }
          setActiveTab(tab);
        }}
        onOpenCreate={() => setIsCreateOpen(true)}
        currentUser={currentUser}
        onLogOut={() => {
          setIsLoggedIn(false);
        }}
      />

      {/* Main Content Pane */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col relative">
        
        {/* Dynamic header present on feed, explore, profile tabs for coherent indexing */}
        {activeTab !== 'shorts' && (
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeTagFilter={activeTagFilter}
            setActiveTagFilter={setActiveTagFilter}
            currentUser={currentUser}
            onLogOut={() => {
              setIsLoggedIn(false);
            }}
          />
        )}

        {/* Dynamic success publish notification popup banner */}
        {publishSuccess && (
          <div className="fixed top-20 right-4 md:right-8 bg-green-600 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-2xl border border-green-500 flex items-center gap-2 z-50 animate-bounce">
            <Check className="w-4 h-4 text-white stroke-[3]" />
            <span>Successfully Published in the Feed!</span>
          </div>
        )}

        {/* Tab Selection Switch */}
        <div id="active-tab-container" className="flex-1 w-full max-w-5xl mx-auto py-4">
          
          {/* A. Combined Instagram & YouTube Feed tab */}
          {activeTab === 'feed' && (
            <div className="w-full max-w-5xl mx-auto px-4 pb-20 flex flex-col lg:flex-row gap-6">
              
              {/* Main Feed items */}
              <div className="flex-1 max-w-2xl">
                {/* Instagram Stories segment on top of combined feed */}
                <StoriesBar
                  stories={stories}
                  currentUserAvatar={currentUser.avatar}
                />

                <div className="mt-6 space-y-6">
                  {feedPosts.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/10 border border-zinc-850 border-dashed rounded-3xl p-6">
                      <AlertCircle className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                      <p className="text-zinc-300 font-bold mb-1">No Combined items found</p>
                      <p className="text-zinc-500 text-xs mb-4">Try clearing active filters or adjusting the search term.</p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setActiveTagFilter('');
                        }}
                        className="px-4 py-2 rounded-xl bg-red-650 hover:bg-red-750 text-xs font-bold text-white transition-colors cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    feedPosts.map(post => (
                      <div key={post.id} id={`post-card-${post.id}`}>
                        <PostCard
                          post={post}
                          currentUsername={currentUser.username}
                          currentUserAvatar={currentUser.avatar}
                          onLike={handleLike}
                          onDislike={handleDislike}
                          onSave={handleSave}
                          onAddComment={handleAddComment}
                          onAuthorClick={handleAuthorClick}
                          onTagClick={(tag) => {
                            setActiveTagFilter(tag);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          isSaved={savedPostIds.includes(post.id)}
                          isFollowed={followedCreators.includes(post.author)}
                          onFollowToggle={() => toggleFollowCreator(post.author)}
                          isSubscribed={subscribedCreators.includes(post.author)}
                          onSubscribeToggle={() => toggleSubscribeCreator(post.author)}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* High-Density Right Sidebar matching Design HTML */}
              <aside className="hidden lg:flex w-72 border border-zinc-800 rounded-2xl flex-col p-4 bg-zinc-900/30 shrink-0 h-fit sticky top-22 self-start select-none">
                <h2 className="text-xs uppercase tracking-wider font-extrabold text-zinc-400 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Trending for you
                </h2>
                <div className="space-y-4">
                  <div 
                    className="flex gap-3 group cursor-pointer" 
                    onClick={() => { setActiveTagFilter('cyberpunk'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    <div className="w-11 h-11 bg-zinc-800 rounded-lg shrink-0 overflow-hidden relative border border-zinc-800">
                      <img src="https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-xs font-bold text-zinc-200 group-hover:text-red-400 transition-colors">#cyberpunk</span>
                      <span className="text-[10px] text-zinc-500 font-mono">12.5k posts this hour</span>
                    </div>
                  </div>

                  <div 
                    className="flex gap-3 group cursor-pointer" 
                    onClick={() => { setActiveTagFilter('travel'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    <div className="w-11 h-11 bg-zinc-800 rounded-lg shrink-0 overflow-hidden relative border border-zinc-800">
                      <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-xs font-bold text-zinc-200 group-hover:text-red-400 transition-colors">#travel</span>
                      <span className="text-[10px] text-zinc-500 font-mono">8.2k posts this hour</span>
                    </div>
                  </div>

                  <div 
                    className="flex gap-3 group cursor-pointer" 
                    onClick={() => { setActiveTagFilter('desksetup'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    <div className="w-11 h-11 bg-zinc-800 rounded-lg shrink-0 overflow-hidden relative border border-zinc-800">
                      <img src="https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-xs font-bold text-zinc-200 group-hover:text-red-400 transition-colors">#desksetup</span>
                      <span className="text-[10px] text-zinc-500 font-mono">5.2k posts this hour</span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-zinc-800 my-4"></div>

                <h2 className="text-xs uppercase tracking-wider font-extrabold text-zinc-400 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  Who to follow
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between" onClick={() => handleAuthorClick('clara_travels')}>
                    <div className="flex items-center gap-2.5 cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-0.5 shadow-md">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" className="w-full h-full rounded-full object-cover border border-black" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-zinc-200 hover:text-red-400 transition-colors">clara_travels</span>
                        <span className="text-[9px] text-zinc-500 font-mono">Follows you</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFollowCreator('clara_travels'); }}
                      className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                        followedCreators.includes('clara_travels')
                        ? 'bg-zinc-800 border-zinc-700 text-zinc-400'
                        : 'bg-white text-black border-white hover:bg-neutral-200'
                      }`}
                    >
                      {followedCreators.includes('clara_travels') ? 'Following' : 'Follow'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between" onClick={() => handleAuthorClick('clara_travels')}>
                    <div className="flex items-center gap-2.5 cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-0.5 shadow-md">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80" className="w-full h-full rounded-full object-cover border border-black" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-zinc-200 hover:text-red-400 transition-colors">alex_vibes</span>
                        <span className="text-[9px] text-zinc-500 font-mono">Suggested</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFollowCreator('alex_vibes'); }}
                      className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                        followedCreators.includes('alex_vibes')
                        ? 'bg-zinc-800 border-zinc-700 text-zinc-400'
                        : 'bg-white text-black border-white hover:bg-neutral-200'
                      }`}
                    >
                      {followedCreators.includes('alex_vibes') ? 'Following' : 'Follow'}
                    </button>
                  </div>
                </div>

                <div className="h-px bg-zinc-800 my-4"></div>

                <footer className="mt-2">
                  <div className="flex flex-wrap gap-x-2.5 gap-y-1 text-[10px] text-zinc-500 leading-tight">
                    <span className="hover:underline cursor-pointer">About</span>
                    <span>•</span>
                    <span className="hover:underline cursor-pointer">Press</span>
                    <span>•</span>
                    <span className="hover:underline cursor-pointer">Copyright</span>
                    <span>•</span>
                    <span className="hover:underline cursor-pointer">Contact</span>
                  </div>
                  <p className="text-[10px] text-zinc-650 font-mono mt-2.5">© 2026 TubeGram Inc.</p>
                </footer>
              </aside>

            </div>
          )}

          {/* B. Explore grid Tab (Instagram Discovery Grid with instant click filters) */}
          {activeTab === 'explore' && (
            <div className="px-4 pb-24">
              <div className="flex items-center gap-2 mb-6 border-b border-zinc-850 pb-3">
                <Compass className="w-5.5 h-5.5 text-red-500 animate-spin-slow" />
                <h2 className="text-base font-extrabold text-white tracking-tight uppercase">Discover Visual Spotlight</h2>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="text-center py-16">
                  <AlertCircle className="w-12 h-12 text-zinc-600 mx-auto mb-2" />
                  <p className="text-zinc-400 font-medium">Nothing found matching terms</p>
                </div>
              ) : (
                /* Beautiful Bento-style grid layout pairing photography and big video layouts */
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredPosts.map((post, index) => {
                    // Make index 1, 4 or 7 large columns to mimic complex discovery feeds
                    const isFeatured = index % 4 === 1;

                    return (
                      <div
                        key={post.id}
                        onClick={() => handleProfilePostClick(post.id)}
                        className={`group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/60 cursor-pointer shadow-md min-h-[160px] ${
                          isFeatured ? 'col-span-2 row-span-2 aspect-[4/3] md:aspect-square' : 'aspect-square'
                        }`}
                      >
                        <img
                          src={post.type === 'video' ? (post.thumbnailUrl || post.mediaUrl) : post.mediaUrl}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Interactive badges indicating type */}
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md p-2 rounded-xl text-white">
                          {post.type === 'video' ? (
                            <div className="flex items-center gap-1">
                              <Play className="w-3.5 h-3.5 fill-white" />
                              <span className="text-[9px] font-bold font-mono text-zinc-300">{post.duration}</span>
                            </div>
                          ) : post.type === 'short' ? (
                            <Film className="w-3.5 h-3.5 text-red-500" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                          )}
                        </div>

                        {/* Hover Overlay with counts */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                          <p className="text-sm font-bold text-white tracking-tight line-clamp-1 mb-1">{post.title}</p>
                          <div className="flex items-center gap-3 text-xs font-mono font-bold text-zinc-300">
                            <span>❤️ {post.likes}</span>
                            <span>💬 {post.comments.length}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* C. Immersive Shorts vertical Player Tab */}
          {activeTab === 'shorts' && (
            <div className="pb-24 flex items-center justify-center">
              <ShortsFeed
                posts={posts}
                currentUserAvatar={currentUser.avatar}
                onLike={handleLike}
                onDislike={handleDislike}
                onSave={handleSave}
                onAddComment={handleAddComment}
                followedCreators={followedCreators}
                toggleFollowCreator={toggleFollowCreator}
                savedPostIds={savedPostIds}
              />
            </div>
          )}

          {/* D. Unified Profiles (View Self profile, or another creator profile) */}
          {activeTab === 'profile' && (
            <div>
              {/* Back button if browsing a different creator */}
              {viewingCreatorUsername !== null && (
                <div className="max-w-4xl mx-auto px-4 mb-3">
                  <button
                    onClick={() => {
                      setViewingCreatorUsername(null);
                      setActiveTab('feed');
                    }}
                    className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 cursor-pointer bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl transition-all w-fit"
                  >
                    <ChevronLeft className="w-4 h-4 text-red-505" />
                    <span>Back to Feed</span>
                  </button>
                </div>
              )}

              <UserProfileView
                profile={currentlyBrowsedProfile}
                posts={posts}
                savedPostIds={savedPostIds}
                followedCreators={followedCreators}
                toggleFollowCreator={toggleFollowCreator}
                subscribedCreators={subscribedCreators}
                toggleSubscribeCreator={toggleSubscribeCreator}
                onPostClick={handleProfilePostClick}
                isCurrentUser={viewingCreatorUsername === null}
                onUpdateBio={handleUpdateBio}
              />
            </div>
          )}

        </div>
      </main>

      {/* Interactive Publish Creation Studio Modal */}
      {isCreateOpen && (
        <CreatePostModal
          onDismiss={() => setIsCreateOpen(false)}
          onPublish={handlePublishPost}
          currentUserAvatar={currentUser.avatar}
        />
      )}

      {/* Simple slow rotating keyframes for logo and background elements */}
      <style>{`
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 12s linear infinite;
        }
      `}</style>
    </div>
  );
}
