import toast from 'react-hot-toast'

//success
export const customSuccessToast = message => {
  return toast.success(message, { duration: 4000, position: 'top-right' })
}

//error
export const customErrorToast = message => {
  return toast.error(message, { duration: 4000, position: 'top-right' })
}
