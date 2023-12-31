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
  fetchPolicies,
  fetchRequestTypes,
  fetchUsers,
  postLeaveRequest,
  setApply,
  setMyleaves
} from 'src/store/absence-management'
import { useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import PickersComponent from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { getWeekNumbers, handleResponse, successToast } from 'src/helpers/helpers'
import { useTheme } from '@emotion/react'
import { myLeaveRequest } from 'src/helpers/requests'
import { unwrapResult } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import SimpleBackdrop from 'src/@core/components/spinner'
import { customErrorToast, customSuccessToast } from 'src/helpers/custom-components/toasts'
import { fetchHolidays } from 'src/store/apps/accountSetting'
import subDays from 'date-fns/subDays'
import { fetchConfig } from 'src/store/settings'

const defaultValues = {
  requestType: '',
  requestReason: '',
  fromDate: new Date(),
  toDate: new Date(),
  isFromDateHalfDay: false,
  isToDateHalfDay: false
}

const schema = yup.object().shape({
  requestType: yup
    .object()
    .required('Request Type is Required')
    .typeError('Request Type is Required'),
  requestReason: yup.string().required('Reason is Required'),
  fromDate: yup.date().required('From date is Required'),
  toDate: yup.date().required('To date is Required'),
  isFromDateHalfDay: yup.boolean().notRequired(),
  isToDateHalfDay: yup.boolean().notRequired()
})

const isWeekday = date => {
  const day = new Date(date).getDay()

  return day !== 0 && day !== 6
}

const LeaveApplyForm = ({ isOpen, setOpen }) => {
  const dispatch = useDispatch()
  const store = useSelector(state => state.leaveManagement)
  const _settingsStore = useSelector(state => state.settings)
  const theme = useTheme()
  const [isLoading, setLoading] = useState(false)
  const [holidays, setHolidays] = useState([])
  const [weekOffs, setWeekOffs] = useState([])

  const {
    reset,
    register,
    control,
    setValue,
    watch,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    dispatch(fetchPolicies())
    dispatch(fetchUsers())
    dispatch(fetchConfig())
    dispatch(fetchHolidays())
      .then(unwrapResult)
      .then(res => {
        const { result } = res
        setHolidays(result.map(o => subDays(new Date(o.date), 0)))
      })
  }, [])

  useEffect(() => {
    reset()
  }, [isOpen])

  const isWeekday = date => {
    const day = new Date(date).getDay()

    return day !== 0 && day !== 6
  }

  //UPDATE Request STATE
  const updateRequestsState = newReq => {
    let myleaves = [...store.myLeaves]

    myleaves.push(newReq)
    dispatch(setMyleaves(myleaves))
  }

  //submit

  const onSubmit = async formData => {
    try {
      setOpen(false)
      setLoading(true)
      reset()

      const currentUser = JSON.parse(localStorage.getItem('userData'))
      const user = currentUser && store.users.find(o => currentUser.user === o.email)

      const request = myLeaveRequest({
        submittedUserId: user.id,
        requestTypeId: formData.requestType.id,
        ...formData
      })
      dispatch(postLeaveRequest(request))
        .then(unwrapResult)
        .then(res => {
          handleResponse('create', res, updateRequestsState)
          dispatch(fetchDashboard(user.id))
          setLoading(false)
        })
    } catch (error) {
      setLoading(false)
      toast.error(error)
    }
  }

  const filterWeekDays = date => {
    const inputDays = _settingsStore.configuration?.workingdays?.split('-')
    const weekNumbers = getWeekNumbers(inputDays[0], inputDays[1])
    const day = new Date(date).getDay()

    return day >= weekNumbers.start && day <= weekNumbers.end
  }

  const handleFromDateChange = selectedDate => {
    // Set the "to date" value when "from date" changes
    setValue('toDate', selectedDate)
  }

  const handleClose = (e, v) => {
    if (v == 'backdropClick') {
      setOpen(true)
      reset()
    } else {
      setOpen(false)
    }
  }
  const handleBlur = (e, v) => {
    if (v == 'backdropClick') {
      setOpen(true)
      reset()
    } else {
      setOpen(false)
    }
  }
  console.log(watch('requestType'))

  const currentYear = new Date().getFullYear()
  const minDate = new Date(currentYear, 0, 1)
  const maxDate = new Date(currentYear + 1, 11, 31)

  return (
    <>
      <Dialog fullWidth open={isOpen} maxWidth='sm' onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent
            sx={{
              position: 'relative',
              pb: theme => `${theme.spacing(8)} !important`,
              px: theme => [`${theme.spacing(5)} !important, ${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important, ${theme.spacing(12.5)} !important`]
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
              <Typography variant='h5'>Leave Application</Typography>
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
                        getOptionLabel={option => option.typeOfLeave || ''}
                        onChange={(event, value) => {
                          field.onChange(value)
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={Boolean(errors.requestType)}
                            label='Request Type *'
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
                        label='Request Reason *'
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

              <Grid
                item
                xs={8}
                sm={8}
                md={8}
                lg={8}
                // md={watch('requestType') !== 'Permission' ? 8 : 12}
                //lg={watch('requestType') !== 'Permission' ? 8 : 12}
              >
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
                          minDate={minDate}
                          maxDate={maxDate}
                          dateFormat={'yyyy-MM-dd'}
                          excludeDates={[...holidays]}
                          filterDate={filterWeekDays}
                          highlightDates={holidays}
                          customInput={
                            <PickersComponent label='From Date' registername='fromDate' />
                          }
                          onChange={e => {
                            onChange(e), handleFromDateChange(e)
                          }}
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

              {/* {watch("requestType") !== "Permission" &&
                <> */}
              <Grid item xs={4} sm={4} md={4} lg={4}>
                {watch('requestType')?.isPermission !== true && (
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
                              disabled={watch('requestType')?.isPermission == true}
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
                )}
              </Grid>
              <Grid item xs={8} sm={8} md={8} lg={8}>
                {watch('requestType')?.isPermission !== true && (
                  <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
                    <FormControl fullWidth>
                      <Controller
                        name='toDate'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <DatePicker
                            disabled={watch('requestType')?.isPermission == true}
                            id='event-end-date'
                            selected={watch('fromDate') > value ? watch('fromDate') : value}
                            dateFormat={'yyyy-MM-dd'}
                            minDate={watch('fromDate')}
                            maxDate={maxDate}
                            excludeDates={[...holidays]}
                            filterDate={filterWeekDays}
                            highlightDates={holidays}
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
                )}
              </Grid>

              <Grid item xs={4} sm={4} md={4} lg={4}>
                {watch('requestType')?.isPermission !== true && (
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
                              disabled={watch('requestType')?.isPermission == true}
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
                )}
              </Grid>
              {/* </>} */}
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center',
              px: theme => [`${theme.spacing(5)} !important, ${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important, ${theme.spacing(12.5)} !important`]
            }}
          >
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => {
                reset({
                  requestType: '',
                  requestReason: '',
                  fromDate: new Date(),
                  toDate: new Date(),
                  fromSession: '',
                  toSession: ''
                })
                setOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button variant='contained' type='submit' sx={{ mr: 1 }}>
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {isLoading && <SimpleBackdrop />}
    </>
  )
}

export default LeaveApplyForm
