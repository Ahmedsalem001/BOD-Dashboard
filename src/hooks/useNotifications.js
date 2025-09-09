import { useDispatch } from 'react-redux'
import { showSuccessNotification, showErrorNotification } from '../features/notifications/notificationsSlice'

export const useNotifications = () => {
  const dispatch = useDispatch()

  const showSuccess = (message) => {
    dispatch(showSuccessNotification({ type: 'success', message }))
  }

  const showError = (message) => {
    dispatch(showErrorNotification({ type: 'error', message }))
  }

  const showInfo = (message) => {
    dispatch(showSuccessNotification({ type: 'info', message }))
  }

  const showWarning = (message) => {
    dispatch(showSuccessNotification({ type: 'warning', message }))
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning
  }
}
