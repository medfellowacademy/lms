'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Play,
  Pause,
  Volume2,
  VolumeX,
  TrendingUp,
  Search,
  Plus,
  ChevronRight,
  Star,
  Award,
  Zap,
  Clock,
  Eye,
  ThumbsUp,
  Send,
  MoreHorizontal,
  Video,
  Image,
  FileText,
  Link,
  Hash,
  AtSign,
  Filter,
  Grid,
  List,
  Verified,
  Sparkles,
  GraduationCap,
  Stethoscope,
  BookOpen,
  Brain,
  Activity,
} from 'lucide-react';

// Feed posts
const feedPosts = [
  {
    id: 1,
    author: {
      name: 'User Name',
      title: 'Interventional Cardiology Fellow',
      institution: 'Cleveland Clinic',
      avatar: '👩‍⚕️',
      verified: true,
      followers: 12500,
    },
    type: 'video',
    content: 'Just completed a complex CTO case using the retrograde approach! Here\'s a 60-second breakdown of the key wire escalation strategy 🔥',
    media: '/placeholder-video.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600',
    duration: '0:58',
    views: 24500,
    likes: 1892,
    comments: 156,
    shares: 423,
    saves: 892,
    tags: ['CTO', 'Interventional', 'WireEscalation', 'ProTip'],
    timestamp: '2h ago',
    liked: false,
    saved: false,
  },
  {
    id: 2,
    author: {
      name: 'User Name',
      title: 'Structural Heart Attending',
      institution: 'Cedars-Sinai',
      avatar: '👨‍⚕️',
      verified: true,
      followers: 28900,
    },
    type: 'image',
    content: 'Beautiful echo demonstrating severe MR before and after MitraClip. Notice the complete elimination of the jet! Patient walking next day. 💪',
    media: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600',
    thumbnail: '',
    duration: '',
    views: 18200,
    likes: 2341,
    comments: 89,
    shares: 312,
    saves: 567,
    tags: ['MitraClip', 'Structural', 'Echo', 'CaseStudy'],
    timestamp: '5h ago',
    liked: true,
    saved: true,
  },
  {
    id: 3,
    author: {
      name: 'MedFellow Academy',
      title: 'Official Channel',
      institution: 'MedFellow',
      avatar: '🏥',
      verified: true,
      followers: 156000,
    },
    type: 'poll',
    content: '🗳️ Quick Poll: What\'s your preferred hemodynamic support for high-risk PCI?',
    media: '',
    thumbnail: '',
    duration: '',
    views: 0,
    options: [
      { text: 'Impella CP', votes: 45 },
      { text: 'IABP', votes: 28 },
      { text: 'ECMO', votes: 15 },
      { text: 'None/Meds only', votes: 12 },
    ],
    totalVotes: 4521,
    likes: 567,
    comments: 234,
    shares: 89,
    saves: 456,
    tags: ['Poll', 'HemodynamicSupport', 'HighRiskPCI'],
    timestamp: '8h ago',
    liked: false,
    saved: false,
    voted: 'Impella CP',
  },
];

// Trending topics
const trendingTopics = [
  { tag: 'AICardiology', posts: 2450, trending: '+45%' },
  { tag: 'TAVR2024', posts: 1890, trending: '+32%' },
  { tag: 'ComplexPCI', posts: 1560, trending: '+28%' },
  { tag: 'FellowLife', posts: 1230, trending: '+22%' },
  { tag: 'MedicalAI', posts: 980, trending: '+18%' },
];

// Suggested connections
const suggestedConnections = [
  {
    name: 'User Name',
    title: 'EP Fellow',
    institution: 'Duke',
    avatar: '👩‍🔬',
    mutualConnections: 24,
    verified: true,
  },
  {
    name: 'Dr. David Lee',
    title: 'IC Attending',
    institution: 'Stanford',
    avatar: '👨‍🔬',
    mutualConnections: 18,
    verified: true,
  },
  {
    name: 'Dr. Maria Garcia',
    title: 'Research Fellow',
    institution: 'Mayo',
    avatar: '👩‍⚕️',
    mutualConnections: 12,
    verified: false,
  },
];

// Live streams
const liveStreams = [
  {
    id: 1,
    title: 'Live CTO Case - LAD',
    host: 'Dr. Chen',
    viewers: 1245,
    thumbnail: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400',
  },
  {
    id: 2,
    title: 'TAVR Q&A Session',
    host: 'Dr. Miller',
    viewers: 892,
    thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400',
  },
];

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'discover' | 'live' | 'groups'>('feed');
  const [posts, setPosts] = useState(feedPosts);
  const [newPostContent, setNewPostContent] = useState('');

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleSave = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, saved: !post.saved, saves: post.saved ? post.saves - 1 : post.saves + 1 }
        : post
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Users className="w-7 h-7 text-ibmp-500" />
            Medical Social Network
          </h1>
          <p className="text-muted-foreground">
            Share knowledge, connect with peers, and learn from the global medical community
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search posts, people, topics..."
              className="pl-10 pr-4 py-2 rounded-xl bg-muted border border-border w-64"
            />
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Post
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-4">
        {[
          { id: 'feed', label: 'Your Feed', icon: Activity },
          { id: 'discover', label: 'Discover', icon: Search },
          { id: 'live', label: 'Live', icon: Video, badge: '2' },
          { id: 'groups', label: 'Groups', icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.badge && (
              <span className="px-1.5 py-0.5 rounded-full bg-critical-500 text-white text-xs">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'feed' && (
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-6">
            {/* Create Post */}
            <div className="card-elevated p-5">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ibmp-500 to-neural-500 flex items-center justify-center text-lg">
                  👨‍⚕️
                </div>
                <div className="flex-1">
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Share your medical insights, case studies, or questions..."
                    className="w-full p-3 rounded-xl bg-muted border border-border resize-none h-20"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg hover:bg-muted">
                        <Video className="w-5 h-5 text-muted-foreground" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-muted">
                        <Image className="w-5 h-5 text-muted-foreground" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-muted">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-muted">
                        <Hash className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>
                    <button className="btn-primary py-1.5 px-4">Post</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts */}
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-elevated overflow-hidden"
              >
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ibmp-500 to-neural-500 flex items-center justify-center text-xl">
                      {post.author.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold">{post.author.name}</span>
                        {post.author.verified && (
                          <Verified className="w-4 h-4 text-ibmp-500" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {post.author.title} • {post.author.institution}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{post.timestamp}</span>
                    <button className="p-1 rounded-lg hover:bg-muted">
                      <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="text-sm mb-2">{post.content}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-sm text-ibmp-500 hover:underline cursor-pointer">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Media */}
                {post.type === 'video' && (
                  <div className="relative aspect-video bg-steel-900">
                    <img 
                      src={post.thumbnail} 
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </button>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs">
                      {post.duration}
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/70 text-white text-xs flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {(post.views! / 1000).toFixed(1)}K
                    </div>
                  </div>
                )}

                {post.type === 'image' && (
                  <img 
                    src={post.media} 
                    alt=""
                    className="w-full aspect-video object-cover"
                  />
                )}

                {post.type === 'poll' && (
                  <div className="px-4 py-2 space-y-2">
                    {post.options?.map((option, i) => {
                      const percentage = Math.round((option.votes / 100));
                      const isVoted = post.voted === option.text;
                      return (
                        <button
                          key={i}
                          className={`w-full p-3 rounded-xl border-2 text-left relative overflow-hidden transition-all ${
                            isVoted ? 'border-primary' : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div 
                            className="absolute inset-0 bg-ibmp-500/10"
                            style={{ width: `${percentage}%` }}
                          />
                          <div className="relative flex items-center justify-between">
                            <span className="font-medium text-sm">{option.text}</span>
                            <span className="text-sm text-muted-foreground">{percentage}%</span>
                          </div>
                        </button>
                      );
                    })}
                    <div className="text-sm text-muted-foreground text-center mt-2">
                      {post.totalVotes?.toLocaleString()} votes
                    </div>
                  </div>
                )}

                {/* Post Actions */}
                <div className="px-4 py-3 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 ${post.liked ? 'text-critical-500' : 'text-muted-foreground hover:text-critical-500'}`}
                    >
                      <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                      <span className="text-sm">{post.likes.toLocaleString()}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm">{post.shares}</span>
                    </button>
                  </div>
                  <button 
                    onClick={() => handleSave(post.id)}
                    className={`flex items-center gap-1.5 ${post.saved ? 'text-achievement-500' : 'text-muted-foreground hover:text-achievement-500'}`}
                  >
                    <Bookmark className={`w-5 h-5 ${post.saved ? 'fill-current' : ''}`} />
                    <span className="text-sm">{post.saves}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Live Now */}
            <div className="card-elevated p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-critical-500 animate-pulse" />
                Live Now
              </h3>
              <div className="space-y-3">
                {liveStreams.map((stream) => (
                  <div key={stream.id} className="relative rounded-xl overflow-hidden">
                    <img 
                      src={stream.thumbnail} 
                      alt=""
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="text-white text-sm font-medium truncate">{stream.title}</div>
                      <div className="flex items-center justify-between text-xs text-white/70">
                        <span>{stream.host}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {stream.viewers}
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-critical-500 text-white text-xs font-medium">
                      LIVE
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div className="card-elevated p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-ibmp-500" />
                Trending Topics
              </h3>
              <div className="space-y-3">
                {trendingTopics.map((topic, i) => (
                  <div key={topic.tag} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-ibmp-500 hover:underline cursor-pointer">
                        #{topic.tag}
                      </span>
                      <div className="text-xs text-muted-foreground">{topic.posts.toLocaleString()} posts</div>
                    </div>
                    <span className="text-xs text-health-500">{topic.trending}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Connections */}
            <div className="card-elevated p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-neural-500" />
                Suggested Connections
              </h3>
              <div className="space-y-3">
                {suggestedConnections.map((person, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ibmp-500 to-neural-500 flex items-center justify-center">
                      {person.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-sm truncate">{person.name}</span>
                        {person.verified && <Verified className="w-3 h-3 text-ibmp-500" />}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {person.title} • {person.mutualConnections} mutual
                      </div>
                    </div>
                    <button className="btn-secondary text-xs py-1.5 px-3">Connect</button>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-primary hover:underline">
                View more
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'live' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {[...liveStreams, ...liveStreams].map((stream, i) => (
            <div key={i} className="card-elevated overflow-hidden">
              <div className="relative aspect-video">
                <img 
                  src={stream.thumbnail} 
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-critical-500 text-white text-xs font-medium flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  LIVE
                </div>
                <div className="absolute top-4 right-4 px-2 py-1 rounded bg-black/50 text-white text-xs flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {stream.viewers}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold mb-1">{stream.title}</h3>
                  <p className="text-white/70 text-sm">Hosted by {stream.host}</p>
                </div>
              </div>
              <div className="p-4">
                <button className="w-full btn-primary flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  Join Stream
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

