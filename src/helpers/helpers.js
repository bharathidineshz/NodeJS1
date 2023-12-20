import { useTheme } from '@emotion/react'
import { duration } from '@mui/material'
import toast from 'react-hot-toast'

export function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'

  for (let i = 0; i < 6; i++) {
    // Generate a color component, ensuring it's above a certain threshold (e.g., 8)
    const component = Math.floor(Math.random() * (16 - 8)) + 4
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

export function errorToast(message) {
  return toast.error(message, {
    position: 'top-right',
    duration: duration ? duration : 3000
  })
}

export function successToast(message) {
  return toast.success(message, {
    position: 'top-right',
    duration: duration ? duration : 3000
  })
}
