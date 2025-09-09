import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Simple JWT-like token implementation for browser
const JWT_SECRET = 'your-secret-key-change-in-production'

// Simple token encoding/decoding (not secure, just for demo)
const encodeToken = (payload) => {
  const header = { alg: 'HS256', typ: 'JWT' }
  const encodedHeader = btoa(JSON.stringify(header))
  const encodedPayload = btoa(JSON.stringify(payload))
  const signature = btoa(encodedHeader + encodedPayload + JWT_SECRET)
  return `${encodedHeader}.${encodedPayload}.${signature}`
}

const decodeToken = (token) => {
  try {
    const [header, payload, signature] = token.split('.')
    const decodedPayload = JSON.parse(atob(payload))
    return decodedPayload
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// Mock authentication API with JWT
const authAPI = {
  login: async (credentials) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock validation
    if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
      const user = {
        id: 1,
        email: credentials.email,
        name: 'Admin User',
        role: 'admin',
        avatar: 'https://i.pravatar.cc/150?img=1'
      }

      // Generate JWT token
      const token = encodeToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      })

      return {
        user,
        token
      }
    } else {
      throw new Error('Invalid credentials')
    }
  },

  logout: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return true
  },

  validateToken: async (token) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))

      // Verify JWT token
      const decoded = decodeToken(token)

      // Check if token is expired
      if (decoded.exp && decoded.exp < Date.now()) {
        throw new Error('Token expired')
      }

      // Return user data based on token
      return {
        id: decoded.userId,
        email: decoded.email,
        name: 'Admin User',
        role: decoded.role,
        avatar: 'https://i.pravatar.cc/150?img=1'
      }
    } catch (error) {
      throw new Error('Invalid or expired token')
    }
  }
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials)
      // Store token in localStorage
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout()
      // Remove token from localStorage
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      return true
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken')

      if (!token) {
        throw new Error('No auth token found')
      }

      const user = await authAPI.validateToken(token)

      return {
        user,
        token
      }
    } catch (error) {
      // Clear invalid auth data
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      return rejectWithValue(error.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.loading = false
        state.error = null
      })
      // Check auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
      })
  },
})

export const { clearError, clearAuth } = authSlice.actions

// Selectors
export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error

export default authSlice.reducer
