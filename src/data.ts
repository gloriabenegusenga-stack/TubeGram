import { Post, Story, UserProfile } from './types';

export const INITIAL_USER: UserProfile = {
  name: "Alex Rivera",
  username: "alex_journeys",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  bio: "Visual Artist & Filmmaker 🎬 Exploring the intersection of minimalist photography and cinematic stories. Based in Seattle, WA. 🌲",
  followers: 48200,
  following: 512,
  postsCount: 142,
  verified: true
};

export const INITIAL_STORIES: Story[] = [
  {
    id: "s1",
    author: "clara_travels",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    mediaUrl: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=600&q=80",
    type: "image",
    timestamp: "2h ago"
  },
  {
    id: "s2",
    author: "dev_architect",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    mediaUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    type: "image",
    timestamp: "4h ago"
  },
  {
    id: "s3",
    author: "gastronomy_daily",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    mediaUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
    type: "image",
    timestamp: "6h ago"
  },
  {
    id: "s4",
    author: "pixels_curator",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    mediaUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80",
    type: "image",
    timestamp: "12h ago"
  },
  {
    id: "s5",
    author: "soundwave_prod",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    mediaUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    type: "image",
    timestamp: "14h ago"
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: "p1",
    type: "video",
    author: "cinematic_scapes",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    authorFollowers: 325400,
    title: "Cinematic Tokyo Nights — A 4K Neon Cityscape Journey",
    description: "Immersive street photography and slow motion footage of Tokyo's neon alleys. This vlog covers Ginza, Shinjuku Golden Gai, and Shibuya under the pouring rain. Shot on 35mm equivalent anamorphic lenses for that natural anamorphic flare.",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    likes: 24800,
    dislikes: 124,
    views: 189400,
    duration: "1:45",
    tags: ["tokyo", "cinematic", "cyberpunk", "travel", "photography"],
    location: "Shinjuku, Tokyo",
    timestamp: "1 day ago",
    comments: [
      {
        id: "c1_1",
        author: "street_crawler",
        authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
        text: "The anamorphic flares are absolutely gorgeous! What setup was this shot on? 😭🔥",
        timestamp: "18h ago",
        likes: 342
      },
      {
        id: "c1_2",
        author: "tokyo_dreamer",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        text: "This makes me miss Tokyo so much. Golden Gai in the rain is magical.",
        timestamp: "12h ago",
        likes: 189
      }
    ]
  },
  {
    id: "p2",
    type: "photo",
    author: "clara_travels",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    authorFollowers: 89100,
    title: "Endless Horizons of Sossusvlei",
    description: "Chasing golden hour shadows along the ridge lines of Big Daddy dune in Namibia. The contrast between the terracotta orange sand and the violet morning sky is something I will never forget. Truly a lunar experience on Earth.",
    mediaUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5edd0cd9?auto=format&fit=crop&w=1200&q=80",
    likes: 9240,
    dislikes: 0,
    views: 0,
    tags: ["namibia", "desert", "travelphotography", "earth", "minimalism"],
    location: "Sossusvlei Dunes, Namibia",
    timestamp: "4 hours ago",
    comments: [
      {
        id: "c2_1",
        author: "desert_wanderer",
        authorAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80",
        text: "The clean sharp line on the crest of the dune is incredible. Perfect timing Clara!",
        timestamp: "3h ago",
        likes: 54
      }
    ]
  },
  {
    id: "p3",
    type: "short",
    author: "gastronomy_daily",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    authorFollowers: 412000,
    title: "Handmade Sourdough Scoring 🥖✨ #satisfying",
    description: "Crisp crust, wild crumb, ultimate scoring patterns! Sound up for that absolute crunch at the end. Recipe details linked in bio.",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    likes: 85200,
    dislikes: 420,
    views: 1240000,
    duration: "0:15",
    tags: ["sourdough", "satisfying", "baking", "asmr", "shorts"],
    location: "Artisan Kitchen",
    timestamp: "8 hours ago",
    comments: [
      {
        id: "c3_1",
        author: "carb_loverer",
        authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
        text: "That crunch sound was clean! Scoring is an art form itself.",
        timestamp: "7h ago",
        likes: 1250
      },
      {
        id: "c3_2",
        author: "bake_star",
        authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        text: "Hydration % please? The oven spring was phenomenal!",
        timestamp: "5h ago",
        likes: 312
      }
    ]
  },
  {
    id: "p4",
    type: "photo",
    author: "dev_architect",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    authorFollowers: 15400,
    title: "Rainy Afternoon Workspace",
    description: "Minimal desk setup under warm light, listening to lo-fi and drafting building schemes. Keeping it cozy today while the storm passes. What are you building today?",
    mediaUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    likes: 3110,
    dislikes: 0,
    views: 0,
    tags: ["workspace", "minimalism", "desksetup", "developer", "aesthetic"],
    location: "Seattle, WA",
    timestamp: "6 hours ago",
    comments: [
      {
        id: "c4_1",
        author: "setup_patrol",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        text: "Love the mechanical keyboard. Is it custom or stock?",
        timestamp: "4h ago",
        likes: 14
      }
    ]
  },
  {
    id: "p5",
    type: "video",
    author: "automotive_luxe",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    authorFollowers: 125000,
    title: "Drifting Over Alpine Passes — Mountain Roadster Pure ASMR",
    description: "Nothing but the pure roaring sound of a classic inline-6 engine carving corners high up in the Swiss Alps. Filmed on closed mountain roads during early sunrise.",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?auto=format&fit=crop&w=1200&q=80",
    likes: 15200,
    dislikes: 98,
    views: 74200,
    duration: "1:20",
    tags: ["supercars", "roadtrip", "alps", "mountain", "carsofinstagram"],
    location: "Furka Pass, Switzerland",
    timestamp: "2 days ago",
    comments: [
      {
        id: "c5_1",
        author: "petrolhead_99",
        authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
        text: "No background music, just high revving and wind sounds. Pure heaven.",
        timestamp: "1 day ago",
        likes: 672
      }
    ]
  },
  {
    id: "p6",
    type: "short",
    author: "street_crawler",
    authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    authorFollowers: 45000,
    title: "Speeding Train in Osaka 🚇⚡",
    description: "Under the train paths at dusk. Caught the perfect light streak. #osaka #train #cyberpunk #short",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    likes: 42100,
    dislikes: 120,
    views: 654000,
    duration: "0:14",
    tags: ["osaka", "cyberpunk", "japan", "neon", "shorts"],
    location: "Osaka, Japan",
    timestamp: "12 hours ago",
    comments: [
      {
        id: "c6_1",
        author: "tokyo_dreamer",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        text: "The speed ramp effect fits the beat so well!",
        timestamp: "9h ago",
        likes: 85
      }
    ]
  }
];
