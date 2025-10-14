import React, { useState, useEffect, useRef } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

const NewsManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'news',
    status: 'published',
    featured: false,
    tags: '',
    meta_description: ''
  });
  const [mediaItems, setMediaItems] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);

  const categories = [
    { id: 'news', label: 'General News' },
    { id: 'new_lands', label: 'New Properties' },
    { id: 'company_updates', label: 'Property Updates' },
    { id: 'market_insights', label: 'Market Insights' }
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost/Eaglonhytes-main/api/content_posts.php', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.data || []);
      } else {
        console.error('Failed to fetch posts:', data.message);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const newMediaItems = [];
    const newPreviewUrls = [];

    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          alert('Please select only image files');
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          alert('File size must be less than 10MB');
          continue;
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        newPreviewUrls.push(previewUrl);

        // Upload to server
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', 'news');

        const response = await fetch('http://localhost/Eaglonhytes-main/api/upload_image.php?type=news', {
          method: 'POST',
          credentials: 'include',
          body: formData
        });

        const result = await response.json();
        
        if (result.success) {
          newMediaItems.push({
            type: 'image',
            url: result.url,
            caption: file.name.split('.')[0],
            alt: `News image: ${file.name}`
          });
        } else {
          console.error('Upload failed:', result.message);
          alert(`Failed to upload ${file.name}: ${result.message}`);
        }
      }

      setMediaItems(prev => [...prev, ...newMediaItems]);
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleImageUpload(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleImageUpload(files);
  };

  const removeImage = (index) => {
    // Revoke object URL to prevent memory leak
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    
    setMediaItems(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const postData = {
        ...formData,
        media_items: mediaItems,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const url = editingPost 
        ? `http://localhost/Eaglonhytes-main/api/content_posts.php?id=${editingPost.id}`
        : 'http://localhost/Eaglonhytes-main/api/content_posts.php';
      
      const method = editingPost ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(postData)
      });

      const result = await response.json();
      
      if (result.success) {
        alert(editingPost ? 'Post updated successfully!' : 'Post created successfully!');
        resetForm();
        fetchPosts();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      content: post.content || '',
      excerpt: post.excerpt || '',
      category: post.category || 'news',
      status: post.status || 'published',
      featured: post.featured || false,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''),
      meta_description: post.meta_description || ''
    });
    setMediaItems(post.media_items || []);
    setShowForm(true);
  };

  const handleDelete = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`http://localhost/Eaglonhytes-main/api/content_posts.php?id=${postId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Post deleted successfully!');
        fetchPosts();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: 'news',
      status: 'published',
      featured: false,
      tags: '',
      meta_description: ''
    });
    setMediaItems([]);
    setPreviewUrls([]);
    setEditingPost(null);
    setShowForm(false);
    
    // Clean up preview URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create News Post
        </button>
      </div>

      {/* News Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingPost ? 'Edit News Post' : 'Create News Post'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Category and Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      id="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
                      Featured Post
                    </label>
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief summary of the post..."
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Write your news content here..."
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images
                  </label>
                  
                  {/* Upload Area */}
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <PhotoIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">
                      {uploading ? 'Uploading...' : 'Drop images here or click to browse'}
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, GIF up to 10MB each
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {/* Image Previews */}
                  {mediaItems.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {mediaItems.map((item, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={item.url?.startsWith('http') 
                              ? item.url 
                              : `http://localhost/Eaglonhytes-main/api/uploads/${item.url}`}
                            alt={item.alt || `Image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter tags separated by commas"
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    name="meta_description"
                    value={formData.meta_description}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="SEO description (max 160 characters)"
                    maxLength="160"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : editingPost ? 'Update Post' : 'Create Post'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All Posts</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {posts.map((post) => (
            <div key={post.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{post.title}</h4>
                    {post.featured && (
                      <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
                        Featured
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-2">{post.excerpt}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Category: {post.category?.replace('_', ' ')}</span>
                    <span>•</span>
                    <span>Created: {new Date(post.created_at).toLocaleDateString()}</span>
                    {post.media_items && post.media_items.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{post.media_items.length} image(s)</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(post)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {posts.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No news posts found. Create your first post!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsManager;
