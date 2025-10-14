import React, { useState, useEffect } from 'react';
import { CalendarIcon, TagIcon, EyeIcon, UserIcon } from '@heroicons/react/24/outline';
import MediaSlideshow from '../components/MediaSlideshow';

const News = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [slideshowMedia, setSlideshowMedia] = useState([]);
  const [slideshowIndex, setSlideshowIndex] = useState(0);

  const categories = [
    { id: 'all', label: 'All News', color: 'bg-gray-100 text-gray-800' },
    { id: 'news', label: 'General News', color: 'bg-blue-100 text-blue-800' },
    { id: 'new_lands', label: 'New Properties', color: 'bg-green-100 text-green-800' },
    { id: 'company_updates', label: 'Property Updates', color: 'bg-purple-100 text-purple-800' },
    { id: 'market_insights', label: 'Market Insights', color: 'bg-orange-100 text-orange-800' }
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost/Eaglonhytes-main/api/content_posts.php?status=published', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch posts');
      }
    } catch (err) {
      setError('Failed to load news posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const openSlideshow = (mediaItems, index = 0) => {
    setSlideshowMedia(mediaItems);
    setSlideshowIndex(index);
    setShowSlideshow(true);
  };

  const closeSlideshow = () => {
    setShowSlideshow(false);
    setSlideshowMedia([]);
    setSlideshowIndex(0);
  };

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading news...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchPosts}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">News & Updates</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay informed with the latest news, property updates, and market insights from Eaglonhytes Properties.
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : category.color + ' hover:bg-opacity-80'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts found for the selected category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {/* Featured Image */}
                <div 
                  className="relative h-48 bg-gray-200 cursor-pointer group"
                  onClick={() => post.media_items && post.media_items.length > 0 ? openSlideshow(post.media_items, 0) : null}
                >
                  {post.media_items && post.media_items.length > 0 ? (
                    <>
                      {post.media_items[0].type === 'video' ? (
                        <div className="flex items-center justify-center w-full h-full bg-gray-800">
                          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all"></div>
                          <svg className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition-all" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                          {post.media_items.length > 1 && (
                            <div className="absolute bottom-2 right-2 px-2 py-1 text-xs text-white bg-black bg-opacity-60 rounded">
                              {post.media_items.length} media
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <img 
                            src={post.media_items[0].url?.startsWith('http') 
                              ? post.media_items[0].url 
                              : `http://localhost/Eaglonhytes-main/api/uploads/${post.media_items[0].url}`}
                            alt={post.media_items[0].alt || post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Cg fill="%239ca3af"%3E%3Cpath d="M200 120c-22.1 0-40 17.9-40 40s17.9 40 40 40 40-17.9 40-40-17.9-40-40-40zm0 60c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z"/%3E%3Cpath d="M320 100H80c-11 0-20 9-20 20v60c0 11 9 20 20 20h240c11 0 20-9 20-20v-60c0-11-9-20-20-20zm0 80H80v-60h240v60z"/%3E%3C/g%3E%3Ctext x="200" y="220" text-anchor="middle" fill="%236b7280" font-family="Arial, sans-serif" font-size="14"%3EProperty Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          {post.media_items.length > 1 && (
                            <div className="absolute bottom-2 right-2 px-2 py-1 text-xs text-white bg-black bg-opacity-60 rounded">
                              +{post.media_items.length - 1} more
                            </div>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    // Default image for posts without media
                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <p className="text-sm text-gray-500 font-medium">
                          {post.category === 'new_lands' ? 'New Property' : 
                           post.category === 'company_updates' ? 'Property Update' : 'News Article'}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {post.featured && (
                    <div className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded">
                      Featured
                    </div>
                  )}
                  
                  {/* Category badge */}
                  <div className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold bg-black bg-opacity-60 text-white rounded">
                    {post.category === 'new_lands' ? '🏡 New Property' : 
                     post.category === 'company_updates' ? '📢 Update' : 
                     post.category === 'market_insights' ? '📊 Market' : '📰 News'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category & Date */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(post.category)}`}>
                      {post.category?.replace('_', ' ').toUpperCase()}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {formatDate(post.created_at)}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Tags */}
                  {post.tags && typeof post.tags === 'string' && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.split(',').slice(0, 3).map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          <TagIcon className="w-3 h-3 mr-1" />
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-500 text-sm">
                      <UserIcon className="w-4 h-4 mr-1" />
                      {post.author_name || 'Eaglonhytes Team'}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <EyeIcon className="w-4 h-4 mr-1" />
                      {post.views || 0} views
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Media Slideshow */}
      <MediaSlideshow
        mediaItems={slideshowMedia}
        isOpen={showSlideshow}
        onClose={closeSlideshow}
        initialIndex={slideshowIndex}
      />
    </div>
  );
};

export default News;
