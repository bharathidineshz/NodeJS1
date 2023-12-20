// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import {
  Autocomplete,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Typography
} from '@mui/material'

//** Third Party */
import DatePicker, { ReactDatePicker, ReactDatePickerProps } from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyLeaves, putRequest } from 'src/store/leave-management'
import { useEffect } from 'react'
import { Box, display } from '@mui/system'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { errorToast, successToast } from 'src/helpers/helpers'
import { useTheme } from '@emotion/react'
import { LOGGEDUSER, myLeaveRequest } from 'src/helpers/requests'
import { unwrapResult } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

const schema = yup.object().shape({
  requestType: yup.string().required('Request Type is Required'),
  requestReason: yup.string().required('Reason is required'),
  fromDate: yup.date().required(),
  toDate: yup.date().required(),
})

const EditLeaveRequest = ({ isOpen, setOpen, row }) => {
  const dispatch = useDispatch()
  const store = useSelector(state => state.leaveManagement)

  const {
    reset,
    control,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: row,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    reset({
      requestType: row?.requestType,
      requestReason: row?.requestReason,
      fromDate: new Date(row?.fromDate),
      toDate: new Date(row?.toDate),
    })
  }, [reset, row])

  const isWeekday = date => {
    const day = new Date(date).getDay()

    return day !== 0 && day !== 6
  }

  //submit

  const onSubmit = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('userData'))
      const user = store.users.find(o => currentUser.user === o.email)
      const req = store.policies.find(o => o.typeOfLeave === watch("requestType"))
      const request = await myLeaveRequest({ id: row?.id, submittedUserId: 1, requestTypeId: req.id, ...watch() })
      dispatch(putRequest(request)).then(unwrapResult).then((res) => {
        if (res?.status === 200) {
          setOpen(false)
          toast.success('Leave Request Updated', {
            position: 'top-right',
            duration: 3000
          })
          dispatch(fetchMyLeaves())
        } else {
          setOpen(true)
          toast.error('Error Occured', {
            position: 'top-right',
            duration: 3000
          })
        }
      })
    } catch (error) {
      errorToast(error)
    }
    reset({
      requestType: '',
      requestReason: '',
      fromDate: new Date(),
      toDate: new Date(),
    })
  }

  return (
    <Dialog fullWidth open={isOpen} maxWidth='sm' scroll='body' onClose={() => setOpen(false)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{
            position: 'relative',
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <IconButton
            size='small'
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h5'>Edit Leave Request</Typography>
          </Box>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='requestType'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Autocomplete
                      defaultValue={store.policies.find(o => o.typeOfLeave == field.value)}
                      options={store.policies}
                      id='autocomplete-limit-tags'
                      getOptionLabel={option => option.typeOfLeave || ''}
                      onChange={(event, value) => {
                        field.onChange(event.target.innerText);
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={Boolean(errors.requestType)}
                          label='Request Type'
                          placeholder='Approver'
                        />
                      )}
                    />
                  )}
                />
                {errors.requestType && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.requestType.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='requestReason'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      multiline
                      minRows={3}
                      label='Request Reason'
                      onChange={onChange}
                      error={Boolean(errors.requestReason)}
                    />
                  )}
                />
                {errors.requestReason && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.requestReason.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
                <FormControl fullWidth>
                  <Controller
                    name='fromDate'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        selected={value}
                        id='date-picker'
                        onChange={onChange}
                        shouldCloseOnSelect
                        popperPlacement='auto'
                        dateFormat='dd-MMM-yy'
                        customInput={<CustomInput label='From Date' />}
                      />
                    )}
                  />
                  {errors.fromDate && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.fromDate.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </DatePickerWrapper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
                <FormControl fullWidth>
                  <Controller
                    name='toDate'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        selected={value}
                        id='date-picker'
                        onChange={onChange}
                        shouldCloseOnSelect
                        popperPlacement='auto'
                        minDate={watch("fromDate")}
                        dateFormat='dd-MMM-yy'
                        customInput={<CustomInput label='To Date' />}
                      />
                    )}
                  />
                  {errors.toDate && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.toDate.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </DatePickerWrapper>
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='outlined' color='secondary' onClick={() => setOpen(false)}>
            Discard
          </Button>
          <Button variant='contained' type='submit' sx={{ mr: 1 }}>
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditLeaveRequest
