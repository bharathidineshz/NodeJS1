import { useTheme } from '@emotion/react'
import { duration } from '@mui/material'
import toast from 'react-hot-toast'
import { customErrorToast, customSuccessToast } from './custom-components/toasts'

export function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'

  for (let i = 0; i < 6; i++) {
    // Generate a color component, ensuring it's above a certain threshold (e.g., 8)
    const component = Math.floor(Math.random() * (18 - 8)) + 4
    color += letters[component]
  }

  return color
}

export function customToast({ theme, message, isSuccess, duration }) {
  return toast.success(message, {
    duration: duration || 3000,
    style: {
      padding: '16px',
      color: theme.palette.primary.main,
      border: `1px solid ${theme.palette.primary.main}`
    },
    iconTheme: {
      primary: isSuccess ? theme.palette.primary.success : theme.palette.primary.error,
      secondary: theme.palette.primary.contrastText
    }
  })
}

export const handleResponse = (name, data, stateAction, deleteRow) => {
  if (data != null) {
    switch (name) {
      case 'create':
        if (data?.hasError) {
          customErrorToast(data.responseMessage)
        } else {
          customSuccessToast(data.responseMessage)
          stateAction(data.result)
        }
        break
      case 'update':
        if (data.hasError) {
          customErrorToast(data.responseMessage)
        } else {
          customSuccessToast(data.responseMessage)
          stateAction(data.result)
        }
        break
      case 'delete':
        if (data.hasError) {
          customErrorToast(data.responseMessage)
        } else {
          customSuccessToast(data.responseMessage)
          stateAction(deleteRow)
        }
        break

      default:
        break
    }
  }
}
