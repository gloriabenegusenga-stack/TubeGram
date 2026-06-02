export type PostType = 'video' | 'photo' | 'short';

export interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface Post {
  id: string;
  type: PostType;
  author: string;
  authorAvatar: string;
  authorFollowers: number;
  title: string;
  description: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  likes: number;
  dislikes: number;
  views: number;
  duration?: string;
  tags: string[];
  comments: Comment[];
  location?: string;
  timestamp: string;
  hasLiked?: boolean;
  hasDisliked?: boolean;
  hasSaved?: boolean;
}

export interface Story {
  id: string;
  author: string;
  authorAvatar: string;
  mediaUrl: string;
  type: 'image' | 'video';
  timestamp: string;
}

export interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  postsCount: number;
  verified: boolean;
}
