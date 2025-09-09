import { configureStore } from '@reduxjs/toolkit'
import entriesReducer from '../features/entries/entriesSlice'
import notificationsReducer from '../features/notifications/notificationsSlice'
import authReducer from '../features/auth/authSlice'
import themeReducer from '../features/theme/themeSlice'

export const store = configureStore({
  reducer: {
    entries: entriesReducer,
    notifications: notificationsReducer,
    auth: authReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export default store
