import axios from 'axios'

const BASE_URL = 'https://jsonplaceholder.typicode.com'

// Simple cache implementation
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

const getCacheKey = (url, params = {}) => {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      result[key] = params[key]
      return result
    }, {})
  return `${url}?${JSON.stringify(sortedParams)}`
}

const getCachedData = (key) => {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  cache.delete(key)
  return null
}

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
}

const invalidateCache = (pattern) => {
  if (pattern) {
    // Invalidate specific cache entries matching pattern
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key)
      }
    }
  } else {
    // Clear all cache
    cache.clear()
  }
}

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add JWT token to requests
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors with more specific messages
    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      const message = error.response.data?.message || getErrorMessage(status)
      return Promise.reject(new Error(message))
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error('Network error - please check your connection'))
    } else {
      // Something else happened
      return Promise.reject(new Error('An unexpected error occurred'))
    }
  }
)

// Helper function to get user-friendly error messages
const getErrorMessage = (status) => {
  switch (status) {
    case 400:
      return 'Bad request - please check your input'
    case 401:
      return 'Unauthorized - please log in again'
    case 403:
      return 'Forbidden - you do not have permission to perform this action'
    case 404:
      return 'Resource not found'
    case 429:
      return 'Too many requests - please try again later'
    case 500:
      return 'Server error - please try again later'
    case 502:
      return 'Bad gateway - service temporarily unavailable'
    case 503:
      return 'Service unavailable - please try again later'
    default:
      return 'An error occurred'
  }
}

// Enhanced API with more realistic data
export const postsAPI = {
  // Get all posts with enhanced data and caching
  getPosts: async () => {
    const cacheKey = getCacheKey('/posts')
    const cachedData = getCachedData(cacheKey)

    if (cachedData) {
      return cachedData
    }

    const response = await api.get('/posts')
    // Enhance posts with more realistic data
    const enhancedPosts = response.data.map(post => ({
      ...post,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: ['published', 'draft', 'archived'][Math.floor(Math.random() * 3)],
      views: Math.floor(Math.random() * 10000),
      likes: Math.floor(Math.random() * 500),
      tags: ['technology', 'programming', 'web development', 'react', 'javascript', 'tutorial'][Math.floor(Math.random() * 6)],
      excerpt: post.body.substring(0, 150) + '...',
      author: {
        id: post.userId,
        name: `User ${post.userId}`,
        email: `user${post.userId}@example.com`,
        avatar: `https://i.pravatar.cc/150?img=${post.userId}`
      }
    }))

    const result = { ...response, data: enhancedPosts }
    setCachedData(cacheKey, result)
    return result
  },

  // Get single post
  getPost: (id) => api.get(`/posts/${id}`),

  // Get posts by user
  getPostsByUser: (userId) => api.get(`/posts?userId=${userId}`),

  // Create new post
  createPost: async (postData) => {
    // Simulate API call with enhanced data
    const newPost = {
      id: Date.now(),
      ...postData,
      userId: 1, // Current user ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'published',
      views: 0,
      likes: 0,
      tags: postData.tags || [],
      excerpt: postData.body ? postData.body.substring(0, 150) + '...' : '',
      author: {
        id: 1,
        name: 'Current User',
        email: 'user@example.com',
        avatar: 'https://i.pravatar.cc/150?img=1'
      }
    }

    // Invalidate posts cache since we added a new post
    invalidateCache('/posts')

    return { data: newPost }
  },

  // Update post
  updatePost: async (id, postData) => {
    // Simulate API call
    const updatedPost = {
      id,
      ...postData,
      updatedAt: new Date().toISOString(),
    }

    // Invalidate posts cache since we updated a post
    invalidateCache('/posts')

    return { data: updatedPost }
  },

  // Delete post
  deletePost: async (id) => {
    // Simulate API call
    const result = { data: { id, deleted: true } }

    // Invalidate posts cache since we deleted a post
    invalidateCache('/posts')

    return result
  },

  // Get users with enhanced data and caching
  getUsers: async () => {
    const cacheKey = getCacheKey('/users')
    const cachedData = getCachedData(cacheKey)

    if (cachedData) {
      return cachedData
    }

    const response = await api.get('/users')
    const enhancedUsers = response.data.map(user => ({
      ...user,
      avatar: `https://i.pravatar.cc/150?img=${user.id}`,
      role: ['admin', 'editor', 'author', 'subscriber'][Math.floor(Math.random() * 4)],
      status: ['active', 'inactive'][Math.floor(Math.random() * 2)],
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      bio: `This is a bio for ${user.name}. They are passionate about technology and innovation.`,
      location: ['New York', 'London', 'Tokyo', 'Paris', 'Sydney'][Math.floor(Math.random() * 5)],
      website: `https://${user.username.toLowerCase()}.com`,
      socialMedia: {
        twitter: `@${user.username}`,
        linkedin: `linkedin.com/in/${user.username}`,
        github: `github.com/${user.username}`
      }
    }))

    const result = { ...response, data: enhancedUsers }
    setCachedData(cacheKey, result)
    return result
  },

  // Get single user
  getUser: (id) => api.get(`/users/${id}`),

  // Get comments for a post
  getPostComments: (postId) => api.get(`/posts/${postId}/comments`),
}

// Keep the old API for backward compatibility
export const jsonPlaceholderAPI = postsAPI

export default api
