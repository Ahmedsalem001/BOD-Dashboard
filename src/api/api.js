import axios from 'axios'

// Base API configuration
const API_CONFIG = {
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
}

// Create axios instance
const api = axios.create(API_CONFIG)

// Request interceptor for auth
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 
                   error.message || 
                   'An error occurred'
    return Promise.reject(new Error(message))
  }
)

// Data enhancement utilities
const enhancePost = (post) => ({
  ...post,
  createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  status: ['published', 'draft', 'archived'][Math.floor(Math.random() * 3)],
  views: Math.floor(Math.random() * 10000),
  likes: Math.floor(Math.random() * 500),
  tags: ['technology', 'programming', 'web development', 'react', 'javascript', 'tutorial'][Math.floor(Math.random() * 6)],
  excerpt: post.body?.substring(0, 150) + '...' || '',
  author: {
    id: post.userId,
    name: `User ${post.userId}`,
    email: `user${post.userId}@example.com`,
    avatar: `https://i.pravatar.cc/150?img=${post.userId}`
  }
})

const enhanceUser = (user) => ({
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
})

// API methods
export const postsAPI = {
  getPosts: async () => {
    const response = await api.get('/posts')
    return { ...response, data: response.data.map(enhancePost) }
  },

  getPost: (id) => api.get(`/posts/${id}`),

  createPost: async (postData) => {
    const newPost = {
      id: Date.now(),
      ...postData,
      userId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'published',
      views: 0,
      likes: 0,
      tags: postData.tags || [],
      excerpt: postData.body?.substring(0, 150) + '...' || '',
      author: {
        id: 1,
        name: 'Current User',
        email: 'user@example.com',
        avatar: 'https://i.pravatar.cc/150?img=1'
      }
    }
    return { data: newPost }
  },

  updatePost: async (id, postData) => ({
    data: { id, ...postData, updatedAt: new Date().toISOString() }
  }),

  deletePost: async (id) => ({ data: { id, deleted: true } }),

  getUsers: async () => {
    const response = await api.get('/users')
    return { ...response, data: response.data.map(enhanceUser) }
  },

  getUser: (id) => api.get(`/users/${id}`),

  getPostComments: (postId) => api.get(`/posts/${postId}/comments`)
}

export default api
