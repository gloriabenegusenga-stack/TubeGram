import React, { useState, useRef } from 'react';
import { X, Image, Play, Film, MapPin, Tag, Check, Award, Upload } from 'lucide-react';
import { Post, PostType } from '../types';

interface FileUploaderProps {
  onFileLoaded: (file: File, type: PostType) => void;
  currentType: PostType;
}

function FileUploader({ onFileLoaded, currentType }: FileUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [loadedFileName, setLoadedFileName] = useState<string | null>(null);
  const [loadedFileSize, setLoadedFileSize] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File | undefined) => {
    if (!file) return;
    
    // Determine type
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    
    if (!isVideo && !isImage) {
      alert("Please upload an image or video file.");
      return;
    }

    const type: PostType = isVideo ? 'video' : 'photo';
    setLoadedFileName(file.name);
    
    // Format size
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    setLoadedFileSize(`${sizeInMB} MB`);
    
    onFileLoaded(file, type);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerSearch = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={triggerSearch}
      className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 relative ${
        isDragActive 
          ? 'border-red-500 bg-red-500/5' 
          : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-900/20'
      }`}
    >
      <input 
        ref={fileInputRef}
        type="file" 
        className="hidden" 
        accept="image/*,video/*" 
        onChange={handleFileChange}
      />
      
      <div className="bg-zinc-900 p-2.5 rounded-full border border-zinc-800 text-zinc-400 group-hover:text-white transition-colors">
        <Upload className="w-5 h-5 text-red-500" />
      </div>

      {loadedFileName ? (
        <div className="space-y-1">
          <p className="text-xs font-bold text-zinc-205 line-clamp-1 px-4">{loadedFileName}</p>
          <p className="text-[10px] text-zinc-500 font-mono">
            {loadedFileSize} • <span className="text-red-400 capitalize font-bold">{currentType}</span>
          </p>
        </div>
      ) : (
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-zinc-300">
            Drag & Drop video/image here, or <span className="text-red-400 underline decoration-red-500/40">browse files</span>
          </p>
          <p className="text-[10px] text-zinc-500">Supports MP4, MOV, JPG, PNG up to 100MB</p>
        </div>
      )}
    </div>
  );
}

interface CreatePostModalProps {
  onDismiss: () => void;
  onPublish: (newPost: Omit<Post, 'id' | 'likes' | 'dislikes' | 'views' | 'comments' | 'timestamp' | 'hasLiked' | 'hasDisliked' | 'hasSaved'>) => void;
  currentUserAvatar: string;
}

// Predefined Gorgeous presets so creating posts is effortless and high fidelity!
const MEDIA_PRESETS = [
  {
    name: "Golden Desert Dunes",
    type: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1200&q=80",
    tags: "desert,travel,sunset,golden,earth",
    location: "Dead Vlei, Namibia"
  },
  {
    name: "Cozy Coffee Loft Workspace",
    type: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=1200&q=80",
    tags: "workspace,coffee,desksetup,developer,minimal",
    location: "Copenhagen, Denmark"
  },
  {
    name: "Cyberpunk Tokyo Crossroads",
    type: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=1200&q=80",
    tags: "cyberpunk,tokyo,neon,nightlife,streetphotography",
    location: "Shibuya, Tokyo"
  },
  {
    name: "Handmade Sourdough Scoring (Video Demo)",
    type: "short",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    tags: "sourdough,baking,asmr,satisfying,shorts",
    location: "Artisan Bakery"
  },
  {
    name: "Classic Roadster Mountain ASMR (Video Demo)",
    type: "video",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?auto=format&fit=crop&w=1200&q=80",
    tags: "roadtrip,alps,v6,classiccars,pureasmr",
    location: "Grimsel Pass, Switzerland"
  },
  {
    name: "Neon Lights City Transit (Short Video)",
    type: "short",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    tags: "osaka,tokyo,subway,night,cyberpunk",
    location: "Subway Station"
  }
];

export default function CreatePostModal({ onDismiss, onPublish, currentUserAvatar }: CreatePostModalProps) {
  const [postType, setPostType] = useState<PostType>('photo');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState(MEDIA_PRESETS[0].mediaUrl);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [location, setLocation] = useState(MEDIA_PRESETS[0].location);
  const [tagsInput, setTagsInput] = useState(MEDIA_PRESETS[0].tags);
  const [selectedPresetIdx, setSelectedPresetIdx] = useState<number | null>(0);

  const applyPreset = (idx: number) => {
    const preset = MEDIA_PRESETS[idx];
    setSelectedPresetIdx(idx);
    setPostType(preset.type as PostType);
    setMediaUrl(preset.mediaUrl);
    setThumbnailUrl(preset.thumbnailUrl || '');
    setLocation(preset.location);
    setTagsInput(preset.tags);
    setTitle(`My custom ${preset.name}`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !mediaUrl.trim() || !description.trim()) return;

    // Parse workspace tags inputs
    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0);

    onPublish({
      type: postType,
      author: "alex_journeys", // current profile username
      authorAvatar: currentUserAvatar,
      authorFollowers: 48200,
      title: title.trim(),
      description: description.trim(),
      mediaUrl: mediaUrl.trim(),
      thumbnailUrl: thumbnailUrl.trim() ? thumbnailUrl.trim() : undefined,
      location: location.trim() ? location.trim() : undefined,
      tags,
      duration: postType === 'video' ? '1:15' : postType === 'short' ? '0:15' : undefined
    });

    onDismiss();
  };

  return (
    <div id="create-post-modal" className="fixed inset-0 bg-zinc-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/40">
          <div className="flex items-center gap-2">
            <Award className="w-5.5 h-5.5 text-red-500 animate-pulse" />
            <span className="font-extrabold text-white tracking-tight uppercase text-xs">Publish Studio</span>
          </div>
          <button
            onClick={onDismiss}
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5.5 h-5.5" />
          </button>
        </div>

        {/* Content body with split columns: Left Presets & Previews, Right configuration Form */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 no-scrollbar">
          
          {/* Column 1: Presets selection panel & Media Preview */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Step 1: Pick High-Fidelity Asset Presets
            </h3>
            
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 no-scrollbar border border-zinc-850 p-2 rounded-xl bg-zinc-950/30">
              {MEDIA_PRESETS.map((preset, idx) => {
                const isActive = selectedPresetIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(idx)}
                    className={`p-2 rounded-lg border text-left flex flex-col gap-1 cursor-pointer transition-all ${
                      isActive 
                        ? 'border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30' 
                        : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                    }`}
                  >
                    <div className="aspect-video w-full rounded overflow-hidden select-none relative bg-black/40">
                      <img
                        src={preset.type === 'video' ? (preset.thumbnailUrl || preset.mediaUrl) : preset.mediaUrl}
                        alt="preset"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 text-[8px] bg-black/80 text-zinc-300 font-bold px-1 py-0.5 rounded uppercase">
                        {preset.type}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-300 truncate w-full">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Drag and Drop / Manual selection File Uploader Area */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Step 1.5: Or Drag & Drop / Upload your files
              </span>
              <FileUploader 
                onFileLoaded={(file, type) => {
                  const objectUrl = URL.createObjectURL(file);
                  setMediaUrl(objectUrl);
                  setPostType(type);
                  setSelectedPresetIdx(null);
                  if (title === '' || title.startsWith('My custom')) {
                    // Extract name from file
                    const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
                    setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
                  }
                }}
                currentType={postType}
              />
            </div>

            {/* Custom URL Option toggle */}
            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-850/60 space-y-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Or Use Custom External Links
              </span>
              <input
                type="url"
                placeholder="https://example.com/asset.jpg"
                value={mediaUrl}
                onChange={(e) => {
                  setMediaUrl(e.target.value);
                  setSelectedPresetIdx(null);
                }}
                className="w-full text-xs p-2 bg-zinc-900 border border-zinc-801 rounded-lg text-zinc-200 placeholder-zinc-650 focus:border-red-500 outline-none"
              />
            </div>

            {/* Visual Media Indicator Preview Area */}
            <div className="space-y-1.5 p-3.5 bg-zinc-900 rounded-xl border border-zinc-800/80">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Live Preview</span>
              <div className="aspect-video w-full bg-black rounded-lg overflow-hidden flex items-center justify-center border border-zinc-850 relative">
                {postType === 'photo' ? (
                  <img
                    src={mediaUrl}
                    alt="Media preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                ) : (
                  <div className="relative w-full h-full flex flex-col items-center justify-center bg-zinc-950 p-4">
                    {mediaUrl.startsWith('blob:') ? (
                      <video 
                        src={mediaUrl} 
                        className="w-full h-full object-cover" 
                        controls 
                        autoPlay 
                        muted 
                        loop
                      />
                    ) : (
                      <>
                        <span className="text-xs text-zinc-400 font-mono">Video Link Connected</span>
                        <Play className="w-8 h-8 text-red-500 absolute animate-pulse" />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Form submission fields */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Step 2: Configuration Details
            </h3>

            {/* Medium Type Switchers: Photo vs Video vs Shorts */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-zinc-950 rounded-xl border border-zinc-850">
              {[
                { id: 'photo', label: 'Photo View', icon: Image },
                { id: 'video', label: 'Long Video', icon: Play },
                { id: 'short', label: 'Short / Reel', icon: Film },
              ].map(item => {
                const Icon = item.icon;
                const isSelected = postType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setPostType(item.id as PostType);
                      setSelectedPresetIdx(null);
                    }}
                    className={`py-2 rounded-lg flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-red-600 text-white font-bold scale-[1.02] shadow-md shadow-red-650/15'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] tracking-wide font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Title / Headline</label>
              <input
                type="text"
                required
                maxLength={70}
                placeholder="Give your post a YouTube title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs p-2.5 bg-zinc-950 border border-zinc-850 focus:border-red-500 rounded-xl text-zinc-100 outline-none placeholder-zinc-600"
              />
            </div>

            {/* Caption / Description */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Caption / Details</label>
              <textarea
                required
                rows={3}
                placeholder="Describe your creation... Use #hashtags like #travel to make it searchable."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-2.5 bg-zinc-950 border border-zinc-850 focus:border-red-500 rounded-xl text-zinc-100 outline-none placeholder-zinc-650 font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Location Tagging */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Venice, Italy"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setSelectedPresetIdx(null);
                  }}
                  className="w-full text-xs p-2.5 bg-zinc-950 border border-zinc-850 focus:border-red-500 rounded-xl text-zinc-100 outline-none placeholder-zinc-600"
                />
              </div>

              {/* Tag system */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-zinc-400" />
                  Tags (comma list)
                </label>
                <input
                  type="text"
                  placeholder="travel, summer, sunset"
                  value={tagsInput}
                  onChange={(e) => {
                    setTagsInput(e.target.value);
                    setSelectedPresetIdx(null);
                  }}
                  className="w-full text-xs p-2.5 bg-zinc-950 border border-zinc-850 focus:border-red-500 rounded-xl text-zinc-100 outline-none placeholder-zinc-600"
                />
              </div>
            </div>

            {/* Thumbnail preview specifically for landscape video triggers */}
            {postType === 'video' && (
              <div className="space-y-1 animate-fade-in p-3 bg-zinc-950/40 rounded-xl border border-zinc-850">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Video Thumbnail URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://example.com/thumbnail.png"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full text-xs p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 outline-none placeholder-zinc-650"
                />
              </div>
            )}

            {/* Bottom Actions Row */}
            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={onDismiss}
                className="flex-1 py-3 border border-zinc-800 hover:bg-zinc-850 hover:text-white rounded-xl text-xs font-semibold text-zinc-400 transition-colors cursor-pointer"
              >
                Draft Preview
              </button>

              <button
                type="submit"
                className="flex-1 py-3 bg-red-650 hover:bg-red-755 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-red-650/20 cursor-pointer transition-colors"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                Publish Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
