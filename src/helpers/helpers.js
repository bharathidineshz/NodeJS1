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

export function ConvertHoursToTime(input) {
  if (typeof input === 'number') {
    // If input is a number, assume it's in decimal hours
    const hours = Math.floor(input)
    const minutes = Math.floor((input - hours) * 60)
    const seconds = Math.round(((input - hours) * 60 - minutes) * 60)

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`
  } else if (typeof input === 'string') {
    // If input is a string, try to parse it as "hh:mm"
    const timeParts = input.split(':')
    if (timeParts.length === 2) {
      const hours = parseInt(timeParts[0], 10)
      const minutes = parseInt(timeParts[1], 10)
      if (!isNaN(hours) && !isNaN(minutes)) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`
      }
    } else {
      return input
    }
  }

  return '00:00:00'
}

export function getWeekNumbers(day1, day2) {
  const getWeekNumber = day => {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ]

    return daysOfWeek.indexOf(day)
  }

  const weekNumber1 = getWeekNumber(day1)
  const weekNumber2 = getWeekNumber(day2)

  return { start: weekNumber1, end: weekNumber2 }
}
