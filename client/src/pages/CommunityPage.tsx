import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { MessageSquare, ThumbsUp, Plus, TrendingUp, Clock, User as UserIcon, Send } from 'lucide-react';

interface Author {
  _id: string;
  name: string;
  profileImage: string;
}

interface Comment {
  _id: string;
  userId: Author;
  text: string;
  createdAt: string;
}

interface Post {
  _id: string;
  userId: Author;
  question: string;
  domain: string;
  level: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

const CommunityPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'latest' | 'trending'>('latest');
  
  // New Post State
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostData, setNewPostData] = useState({ question: '', domain: 'Frontend', level: 'Intermediate' });
  const [posting, setPosting] = useState(false);

  // Comments State
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [sortBy]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/community?sort=${sortBy}`);
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostData.question.trim()) return;
    setPosting(true);
    try {
      const res = await api.post('/community', newPostData);
      setPosts([res.data, ...posts]);
      setNewPostData({ question: '', domain: 'Frontend', level: 'Intermediate' });
      setShowNewPost(false);
    } catch (error) {
      console.error('Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const res = await api.post(`/community/${postId}/like`);
      setPosts(posts.map(p => p._id === postId ? { ...p, likes: res.data.likes } : p));
    } catch (error) {
      console.error('Failed to like post');
    }
  };

  const handleAddComment = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    try {
      const res = await api.post(`/community/${postId}/comment`, { text: commentText });
      setPosts(posts.map(p => p._id === postId ? { ...p, comments: res.data.comments } : p));
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 xl:px-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-[#2A2A35] gap-4">
          <div>
            <h1 className="text-3xl font-black mb-1">Community</h1>
            <p className="text-[var(--color-brand-text-secondary)]">Discuss questions, share tips, and learn with others.</p>
          </div>
          <button 
            onClick={() => setShowNewPost(!showNewPost)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] text-white font-bold transition-all shadow-lg glow-primary self-start md:self-auto"
          >
            <Plus size={18} /> Ask a Question
          </button>
        </div>

        {showNewPost && (
          <div className="bg-[#1A1A22] border border-[#2A2A35] rounded-3xl p-6 mb-8 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
            <h2 className="text-xl font-bold mb-4">Post a new question</h2>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <textarea 
                  value={newPostData.question}
                  onChange={e => setNewPostData({...newPostData, question: e.target.value})}
                  placeholder="What interview question do you want to ask or share?"
                  className="w-full bg-[#0F0F14] border border-[#2A2A35] rounded-xl p-4 text-white outline-none focus:border-[var(--color-brand-primary)] transition-all min-h-[100px] resize-none"
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <select 
                    value={newPostData.domain}
                    onChange={e => setNewPostData({...newPostData, domain: e.target.value})}
                    className="w-full bg-[#0F0F14] border border-[#2A2A35] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-brand-primary)]"
                  >
                    <option value="Frontend">Frontend Development</option>
                    <option value="Backend">Backend Development</option>
                    <option value="Fullstack">Fullstack Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="DevOps">DevOps</option>
                  </select>
                </div>
                <div className="flex-1">
                  <select 
                    value={newPostData.level}
                    onChange={e => setNewPostData({...newPostData, level: e.target.value})}
                    className="w-full bg-[#0F0F14] border border-[#2A2A35] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-brand-primary)]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowNewPost(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold border border-[#2A2A35] hover:bg-[#2A2A35] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={posting}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-secondary)] transition-all flex items-center gap-2"
                >
                  {posting ? 'Posting...' : 'Post Question'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="flex items-center gap-2 mb-6 bg-[#1A1A22] p-1.5 rounded-xl inline-flex border border-[#2A2A35]">
          <button 
            onClick={() => setSortBy('latest')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${sortBy === 'latest' ? 'bg-[#2A2A35] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Clock size={16} /> Latest
          </button>
          <button 
            onClick={() => setSortBy('trending')}
             className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${sortBy === 'trending' ? 'bg-[#2A2A35] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <TrendingUp size={16} /> Trending
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[var(--color-brand-primary)]"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-[var(--color-brand-panel)] rounded-3xl border border-[#2A2A35]">
            <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">No posts yet</h3>
            <p className="text-[var(--color-brand-text-secondary)]">Be the first to ask a question!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <div key={post._id} className="bg-[var(--color-brand-panel)] border border-[#2A2A35] rounded-3xl p-6 transition-all hover:border-[#3A3A45]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1A1A22] rounded-full flex items-center justify-center border border-[#2A2A35] overflow-hidden">
                      {post.userId?.profileImage ? (
                        <img src={post.userId.profileImage} alt={post.userId.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold text-sm">{post.userId?.name?.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{post.userId?.name}</p>
                      <p className="text-xs text-[var(--color-brand-text-secondary)]">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 bg-[#1A1A22] border border-[#2A2A35] rounded-md text-[var(--color-brand-primary)]">{post.domain}</span>
                    <span className="text-xs font-bold px-2.5 py-1 bg-[#1A1A22] border border-[#2A2A35] rounded-md text-[var(--color-brand-secondary)]">{post.level}</span>
                  </div>
                </div>

                <p className="text-lg whitespace-pre-wrap mb-6">{post.question}</p>

                <div className="flex items-center gap-6 border-t border-[#2A2A35] pt-4">
                  <button 
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center gap-2 text-sm font-bold transition-colors ${post.likes.includes(user?._id || '') ? 'text-[var(--color-brand-primary)]' : 'text-[var(--color-brand-text-secondary)] hover:text-white'}`}
                  >
                    <ThumbsUp size={18} className={post.likes.includes(user?._id || '') ? 'fill-current' : ''} /> 
                    {post.likes.length} 
                  </button>
                  <button 
                    onClick={() => setActiveCommentPost(activeCommentPost === post._id ? null : post._id)}
                    className="flex items-center gap-2 text-sm font-bold text-[var(--color-brand-text-secondary)] hover:text-white transition-colors"
                  >
                    <MessageSquare size={18} /> 
                    {post.comments.length}
                  </button>
                </div>

                {activeCommentPost === post._id && (
                  <div className="mt-6 space-y-4 animate-in fade-in duration-200">
                    <div className="space-y-4 mb-4">
                      {post.comments.map(comment => (
                        <div key={comment._id} className="flex gap-3 bg-[#0F0F14] p-3 rounded-2xl">
                          <div className="w-8 h-8 shrink-0 bg-[#1A1A22] rounded-full flex items-center justify-center border border-[#2A2A35] overflow-hidden mt-1">
                             {comment.userId?.profileImage ? (
                              <img src={comment.userId.profileImage} alt={comment.userId.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="font-bold text-xs">{comment.userId?.name?.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-sm">{comment.userId?.name}</span>
                              <span className="text-[10px] text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-gray-300">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={(e) => handleAddComment(post._id, e)} className="flex gap-3">
                      <div className="w-8 h-8 shrink-0 bg-[#1A1A22] rounded-full flex items-center justify-center border border-[#2A2A35]">
                         <UserIcon size={14} className="text-gray-500" />
                      </div>
                      <input 
                        type="text"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 bg-[#1A1A22] border border-[#2A2A35] rounded-full px-4 text-sm text-white outline-none focus:border-[var(--color-brand-primary)]"
                        required
                      />
                      <button 
                        type="submit"
                        className="w-10 h-10 shrink-0 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] rounded-full flex items-center justify-center text-white transition-colors"
                      >
                        <Send size={16} className="-ml-1" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CommunityPage;
