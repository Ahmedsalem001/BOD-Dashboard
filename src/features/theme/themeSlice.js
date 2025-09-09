import { createSlice } from '@reduxjs/toolkit'

// Get theme from localStorage or default to 'light'
const getInitialTheme = () => {
  try {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme || 'light'
  } catch (error) {
    console.warn('Error reading theme from localStorage:', error)
    return 'light'
  }
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: getInitialTheme(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
      // Save to localStorage
      localStorage.setItem('theme', state.mode)
    },
    setTheme: (state, action) => {
      state.mode = action.payload
      // Save to localStorage
      localStorage.setItem('theme', action.payload)
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions

// Selectors
export const selectTheme = (state) => state.theme.mode
export const selectIsDark = (state) => state.theme.mode === 'dark'

export default themeSlice.reducer
