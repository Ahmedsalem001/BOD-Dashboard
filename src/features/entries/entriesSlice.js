import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { postsAPI } from '../../api/api'

// Async thunks
export const fetchEntries = createAsyncThunk(
  'entries/fetchEntries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await postsAPI.getPosts()
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const addEntry = createAsyncThunk(
  'entries/addEntry',
  async (entryData, { rejectWithValue }) => {
    try {
      const response = await postsAPI.createPost(entryData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateEntry = createAsyncThunk(
  'entries/updateEntry',
  async ({ id, ...entryData }, { rejectWithValue }) => {
    try {
      const response = await postsAPI.updatePost(id, entryData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteEntry = createAsyncThunk(
  'entries/deleteEntry',
  async (id, { rejectWithValue }) => {
    try {
      await postsAPI.deletePost(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const entriesSlice = createSlice({
  name: 'entries',
  initialState: {
    items: [],
    loading: false,
    error: null,
    searchTerm: '',
    currentPage: 1,
    itemsPerPage: 10,
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
      state.currentPage = 1 // Reset to first page when searching
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload
      state.currentPage = 1 // Reset to first page when changing items per page
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch entries
      .addCase(fetchEntries.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchEntries.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Add entry
      .addCase(addEntry.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      // Update entry
      .addCase(updateEntry.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      // Delete entry
      .addCase(deleteEntry.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload)
      })
  },
})

export const { setSearchTerm, setCurrentPage, setItemsPerPage, clearError } = entriesSlice.actions

// Selectors
export const selectAllEntries = (state) => state.entries.items
export const selectEntriesLoading = (state) => state.entries.loading
export const selectEntriesError = (state) => state.entries.error
export const selectSearchTerm = (state) => state.entries.searchTerm
export const selectCurrentPage = (state) => state.entries.currentPage
export const selectItemsPerPage = (state) => state.entries.itemsPerPage

// Memoized selectors for better performance
export const selectFilteredEntries = createSelector(
  [selectAllEntries, selectSearchTerm],
  (items, searchTerm) => {
    if (!searchTerm) return items

    return items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.body.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }
)

export const selectPaginatedEntries = createSelector(
  [selectFilteredEntries, selectCurrentPage, selectItemsPerPage],
  (filteredEntries, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    return {
      entries: filteredEntries.slice(startIndex, endIndex),
      totalPages: Math.ceil(filteredEntries.length / itemsPerPage),
      totalItems: filteredEntries.length,
    }
  }
)

export default entriesSlice.reducer