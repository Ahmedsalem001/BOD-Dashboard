import { createSlice } from '@reduxjs/toolkit'

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
  },
  reducers: {
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      }
      state.notifications.push(notification)
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      )
    },
    clearAllNotifications: (state) => {
      state.notifications = []
    },
  },
})

export const { addNotification, removeNotification, clearAllNotifications } = notificationsSlice.actions

// Selectors
export const selectAllNotifications = (state) => state.notifications.notifications

// Action creators for common notification types
export const showSuccessNotification = (notification) => (dispatch) => {
  const message = typeof notification === 'string' ? notification : notification.message
  const type = typeof notification === 'string' ? 'success' : notification.type || 'success'
  const id = Date.now()

  dispatch(addNotification({
    id,
    type,
    message,
    ...notification
  }))

  // Auto-remove after 5 seconds
  setTimeout(() => {
    dispatch(removeNotification(id))
  }, 5000)
}

export const showErrorNotification = (notification) => (dispatch) => {
  const message = typeof notification === 'string' ? notification : notification.message
  const type = typeof notification === 'string' ? 'error' : notification.type || 'error'
  const id = Date.now()

  dispatch(addNotification({
    id,
    type,
    message,
    ...notification
  }))

  // Auto-remove after 7 seconds for errors
  setTimeout(() => {
    dispatch(removeNotification(id))
  }, 7000)
}

export const showInfoNotification = (notification) => (dispatch) => {
  const message = typeof notification === 'string' ? notification : notification.message
  const type = typeof notification === 'string' ? 'info' : notification.type || 'info'
  const id = Date.now()

  dispatch(addNotification({
    id,
    type,
    message,
    ...notification
  }))

  // Auto-remove after 5 seconds
  setTimeout(() => {
    dispatch(removeNotification(id))
  }, 5000)
}

export const showWarningNotification = (notification) => (dispatch) => {
  const message = typeof notification === 'string' ? notification : notification.message
  const type = typeof notification === 'string' ? 'warning' : notification.type || 'warning'
  const id = Date.now()

  dispatch(addNotification({
    id,
    type,
    message,
    ...notification
  }))

  // Auto-remove after 6 seconds
  setTimeout(() => {
    dispatch(removeNotification(id))
  }, 6000)
}

export default notificationsSlice.reducer
