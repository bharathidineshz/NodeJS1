// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import {
  Autocomplete,
  Checkbox,
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
  TextField,
  Typography
} from '@mui/material'

//** Third Party */
import DatePicker, { ReactDatePicker, ReactDatePickerProps } from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchDashboard,
  fetchMyLeaves,
  putRequest,
  setMyleaves
} from 'src/store/absence-management'
import { useEffect, useState } from 'react'
import { Box, display } from '@mui/system'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { errorToast, handleResponse, successToast } from 'src/helpers/helpers'
import { useTheme } from '@emotion/react'
import { LOGGEDUSER, myLeaveRequest } from 'src/helpers/requests'
import { unwrapResult } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import PickersComponent from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { customErrorToast, customSuccessToast } from 'src/helpers/custom-components/toasts'
import { fetchHolidays } from 'src/store/apps/accountSetting'
import subDays from 'date-fns/subDays'
import { setLoading } from 'src/store/authentication/register'
import SimpleBackdrop from 'src/@core/components/spinner'

const schema = yup.object().shape({
  requestType: yup.object().required('Request Type is Required'),
  requestReason: yup.string().required('Reason is required'),
  fromDate: yup.date().required(),
  toDate: yup.date().required(),
  isFromDateHalfDay: false,
  isToDateHalfDay: false
})

const EditLeaveRequest = ({ isOpen, setOpen, row }) => {
  const dispatch = useDispatch()
  const store = useSelector(state => state.leaveManagement)
  const [index, setIndex] = useState(0)
  const [holidays, setHolidays] = useState([])
  const [weekOffs, setWeekOffs] = useState([])
  const [loading, setLoading] = useState(false)

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
    if (row != null) {
      const _index = store.policies.findIndex(o => o.id === row.requestTypeId)
      _index != -1 && setIndex(_index)

      reset({
        requestType: row?.requestType,
        requestReason: row?.requestReason,
        fromDate: new Date(row?.fromDate),
        toDate: new Date(row?.toDate),
        isFromDateHalfDay: row.isFromDateHalfDay,
        isToDateHalfDay: row.isToDateHalfDay
      })
      dispatch(fetchHolidays())
        .then(unwrapResult)
        .then(res => {
          const { result } = res
          setHolidays(result?.map(o => subDays(new Date(o.date), 0)))
        })
    }
  }, [row])

  //UPDATE Request STATE
  const updateRequestsState = newReq => {
    let myLeaves = [...store.myLeaves]
    const indexToReplace = myLeaves.findIndex(item => item.id === newReq.id)

    if (indexToReplace !== -1) {
      myLeaves[indexToReplace] = newReq
    }
    dispatch(setMyleaves(myLeaves))
  }

  //submit

  const onSubmit = async formData => {
    try {
      setOpen(false)
      setLoading(true)
      reset()
      const currentUser = JSON.parse(localStorage.getItem('userData'))
      const user = store.users.find(o => currentUser.user === o.email)
      const request = myLeaveRequest({
        id: row?.id,
        submittedUserId: user.id,
        requestTypeId: formData.requestType.id,
        ...formData
      })
      dispatch(putRequest(request))
        .then(unwrapResult)
        .then(res => {
          handleResponse('update', res.data, updateRequestsState)
          dispatch(fetchDashboard(user.id))
          setLoading(false)
        })
    } catch (error) {
      setLoading(false)
      customErrorToast(error.message)
    }
  }

  const handleClose = (e, v) => {
    if (v == 'backdropClick') {
      setOpen(true)
      reset()
    } else {
      setOpen(false)
    }
  }

  const currentYear = new Date().getFullYear()
  const minDate = new Date(currentYear, 0, 1)
  const maxDate = new Date(currentYear + 1, 11, 31)

  const isWeekday = date => {
    const day = new Date(date).getDay()

    return day !== 0 && day !== 6
  }

  return (
    <>
      {loading && <SimpleBackdrop />}
      <Dialog fullWidth open={isOpen} maxWidth='sm' scroll='body' onClose={handleClose}>
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
              <Typography variant='h5'>Edit Leave Application</Typography>
              <Typography variant='body2'>Update your un-availability by filling form</Typography>
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
                        options={store.policies}
                        id='autocomplete-limit-tags'
                        getOptionLabel={option => option.typeOfLeave || option}
                        defaultValue={store.policies[index]}
                        value={store.policies[index]}
                        onChange={(event, value) => {
                          field.onChange(value)
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={Boolean(errors.requestType)}
                            label='Request Type'
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
                        minRows={2}
                        multiline
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

              <Grid item xs={12} sm={8} md={8} lg={8}>
                <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
                  <FormControl fullWidth>
                    <Controller
                      name='fromDate'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <DatePicker
                          id='event-start-date'
                          selected={value}
                          dateFormat={'yyyy-MM-dd'}
                          minDate={minDate}
                          maxDate={maxDate}
                          excludeDates={holidays}
                          highlightDates={holidays}
                          filterDate={isWeekday}
                          customInput={
                            <PickersComponent label='From Date' registername='fromDate' />
                          }
                          onChange={onChange}
                          popperPlacement='auto'
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

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <FormControl fullWidth>
                  <Controller
                    name='isFromDateHalfDay'
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <FormControlLabel
                        label='Half Day'
                        control={
                          <Checkbox
                            checked={value}
                            defaultChecked={false}
                            onChange={onChange}
                            name='halfDay'
                          />
                        }
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={8} md={8} lg={8}>
                <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
                  <FormControl fullWidth>
                    <Controller
                      name='toDate'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <DatePicker
                          id='event-end-date'
                          selected={watch('fromDate') > value ? watch('fromDate') : value}
                          dateFormat={'yyyy-MM-dd'}
                          minDate={watch('fromDate')}
                          maxDate={maxDate}
                          excludeDates={holidays}
                          highlightDates={holidays}
                          filterDate={isWeekday}
                          customInput={<PickersComponent label='To Date' registername='toDate' />}
                          onChange={onChange}
                          popperPlacement='auto'
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

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <FormControl fullWidth>
                  <Controller
                    name='isToDateHalfDay'
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <FormControlLabel
                        label='Half Day'
                        disabled={
                          watch('fromDate').toDateString() != watch('toDate').toDateString()
                            ? false
                            : true
                        }
                        control={
                          <Checkbox
                            checked={value}
                            defaultChecked={false}
                            onChange={onChange}
                            name='halfDay'
                          />
                        }
                      />
                    )}
                  />
                </FormControl>
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
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => {
                reset()
                setOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button variant='contained' type='submit' sx={{ mr: 1 }}>
              Edit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default EditLeaveRequest
