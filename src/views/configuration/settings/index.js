import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Controller, useForm } from 'react-hook-form'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import {
  Autocomplete,
  Backdrop,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Tab,
  useMediaQuery,
  useTheme
} from '@mui/material'
import {
  fetchConfig,
  addConfig,
  addOrgHrApprove,
  fetchOrgHrApprove,
  putConfig,
  postHRApproval,
  fetchHRApprovals,
  deleteHRApproval
} from 'src/store/settings'

import { WEEKDAYS } from 'src/helpers/constants'
import themeConfig from 'src/configs/themeConfig'
import dynamic from 'next/dynamic'
import currencies from 'src/helpers/currencies.json'
import timezones from 'src/helpers/timezones.json'
import { store } from 'src/store'
import { settingsRequest } from 'src/helpers/requests'
import { unwrapResult } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import SimpleBackdrop from 'src/@core/components/spinner'
import CustomPeoplePicker from 'src/views/components/autocomplete/CustomPeoplePicker'
import CustomHRPicker from 'src/views/components/autocomplete/CustomHRPicker'
import { fetchUsers } from 'src/store/apps/user'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'



const SettingsConfig = () => {
  const { configuration, OrgHrApprove, HrApprovals } = useSelector(state => state.settings)
  const dispatch = useDispatch()
  const _userStore = useSelector(state => state.user)

  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const [isLoading, setLoading] = useState(false)
  const [config, setConfig] = useState({
    startWeekDay: '',
    endWeekDay: '',
    currency: 'INR',
    currencyIndex: 0,
    timezone: '',
    timezoneIndex: 0,
    HR: '',
    hrIndex: 0,
    users: [],
    selectedHRs: []
  })

  const defaultValues = {
    startWeekDay: '',
    endWeekDay: '',
    currency: 'INR',
    // currencyIndex: 0,
    timezone: '',
    // timezoneIndex: 0,
    HR: '',
    // hrIndex: 0,
    // users: [],
    // selectedHRs: []
  }

  const schema = yup.object().shape({
    startWeekDay: yup.string().required('Start day is required'),
    endWeekDay: yup.string().required('End day is required'),
    currency: yup.string().required('Currency is required'),
    timeZone: yup.string().required('Timezone is required'),
    HR: yup.string().required('HR is required')
  })

  useEffect(() => {
    dispatch(fetchUsers())
    dispatch(fetchHRApprovals())
  }, [])

  useEffect(() => {
    if (configuration != null && Object.keys(configuration).length > 0) {
      const currency = currencies.findIndex(o => o.cc == configuration.currency)
      const time = timezones.findIndex(o => o.offset == configuration.timeZone)
      const HRs = _userStore.users.filter(u => HrApprovals.some(o => o.userId === u.id))
      setConfig(state => ({
        ...state,
        users: _userStore.users,
        startWeekDay: configuration.workingdays?.split('-')[0],
        endWeekDay: configuration.workingdays?.split('-')[1],
        currency: currencies[currency],
        currencyIndex: currency,
        timezone: timezones[time],
        timezoneIndex: time,
        selectedHRs: HRs,
        newHR: {}
      }))
    } else {
      setConfig(state => ({
        ...state,
        users: _userStore.users
      }))
    }
  }, [HrApprovals, _userStore.users, configuration])

  //Save Configure
  const handleSaveSettings = request => {
    if (configuration != null && Object.keys(configuration).length > 0) {
      dispatch(putConfig({ id: configuration.id, ...request }))
        .then(unwrapResult)
        .then(res => {
          setLoading(false)
          if (res.status === 200) {
            dispatch(fetchConfig())
            toast.success(res.data)
          } else {
            toast.error(res.data)
          }
        })
    } else {
      dispatch(addConfig(request))
        .then(unwrapResult)
        .then(res => {
          setLoading(false)
          if (res.status === 200 || res.status == 201) {
            dispatch(fetchConfig())
            toast.success(res.data)
          } else {
            toast.error(res.data)
          }
        })
    }
  }

  //Handle HR Approval

  const handleHRApproval = request => {
    dispatch(postHRApproval(request))
      .then(unwrapResult)
      .then(res => {
        setLoading(false)
        if (res.status === 200) {
          dispatch(fetchHRApprovals())
          toast.success(res.data)
        } else {
          toast.error(res.data)
        }
      })
  }

  const {
    register,
    reset,
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  console.log(useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  }))

  // Map Configuration

  const handleConfiguration = (name, value) => {
    var request
    setLoading(true)

  }

  const filteredTimezones = timezones.filter(
    (item, index, self) => index === self.findIndex(i => i.offset === item.offset)
  )

  //handle delete

  const handleDelete = id => {
    if (id != 0 && id != null) {
      dispatch(deleteHRApproval(id))
        .then(unwrapResult)
        .then(res => {
          if (res.status === 200) {
            toast.success(res.data)
            dispatch(fetchHRApprovals())
          } else {
            toast.error(res.data)
          }
        })
    }
  }

  return (
    <Grid className='d-flex'>
      {isLoading && <SimpleBackdrop />}
      <Grid container xs={12} sm={12} md={7} lg={7}>
        <Card>
          <CardHeader title='Configurations' />
          <CardContent>
            <form onSubmit={handleSubmit(handleSaveSettings)}>
              <Grid container spacing={4}>
                {/* working days */}
                <Grid item md={12} xs={12}>
                  <Typography variant='body1' fontWeight='500' color='primary'>
                    Working Days <span style={{ color: 'red' }}>*</span>
                  </Typography>
                </Grid>

                <Grid item xs={4} sm={6} md={6} lg={6}>
                  <FormControl fullWidth>
                    <InputLabel id='demo-simple-select'>Start Date *</InputLabel>
                    <Controller
                      control={control}
                      name='startWeekDay'  // assuming 'startWeekDay' is the name you want to use
                      render={({ field }) => (
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          value={config.startWeekDay}
                          label='Start Date *'
                          {...field}
                          onChange={(e) => handleConfiguration('start', e.target.value)}
                          error={Boolean(errors.startWeekDay)}
                        >
                          {WEEKDAYS.map((day, i) => (
                            <MenuItem key={i} value={day} disabled={config.endWeekDay === day}>
                              {day}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />

                    {errors.startWeekDay && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.startWeekDay.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>


                <Grid item xs={6} sm={6} md={6} lg={6}>
                  <FormControl fullWidth>
                    <InputLabel id='demo-simple-select'>End Date *</InputLabel>
                    <Controller
                      control={control}
                      name='endWeekDay'
                      render={({ field }) => (
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          value={config.endWeekDay}
                          label='End Date *'
                          {...field}
                          onChange={(e) => handleConfiguration('end', e.target.value)}
                          error={Boolean(errors.endWeekDay)}
                        >
                          {WEEKDAYS.map((day, i) => (
                            <MenuItem key={i} value={day} disabled={config.startWeekDay === day}>
                              {day}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />

                    {errors.endWeekDay && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.endWeekDay.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>


                {/* currency */}
                <Grid item md={12} xs={12}>
                  <Typography variant='body1' fontWeight='500' color='primary'>
                    Currency <span style={{ color: 'red' }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      control={control}
                      name='currency'
                      defaultValue={currencies[config.currencyIndex]}
                      render={({ field }) => (
                        <Autocomplete
                          options={currencies}
                          id='autocomplete-limit-tags'
                          getOptionLabel={option => option.cc}
                          value={config.currency}
                          onChange={(e, v) => handleConfiguration('currency', v)}
                          error={Boolean(errors.currency)}
                          renderInput={params => (
                            <TextField {...params} label='Currency' error={config.currency == null} />
                          )}
                        />
                      )}
                    />
                    {errors.currency && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.currency.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>


                {/* Timezone */}

                <Grid item md={12} xs={12}>
                  <Typography variant='body1' fontWeight='500' color='primary'>
                    Timezone <span style={{ color: 'red' }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Controller>
                      <Autocomplete
                        options={timezones}
                        id='autocomplete-limit-tags'
                        getOptionLabel={option => option.offset}
                        defaultValue={filteredTimezones[config.timezoneIndex]}
                        value={config.timezone}
                        onChange={(e, v) => handleConfiguration('timezone', v)}
                        error={Boolean(errors.timezone)}
                        renderInput={params => (
                          <TextField {...params} label='Timezone' error={config.timezone == null} />
                        )}
                      />
                    </Controller>
                    {errors.timezone && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.timezone.message}
                      </FormHelperText>
                    )}
                  </FormControl>

                </Grid>

                {/* HR */}

                <Grid item md={12} xs={12}>
                  <Typography variant='body1' fontWeight='500' color='primary'>
                    HR Approval <span style={{ color: 'red' }}>*</span>
                  </Typography>
                </Grid>
                <Grid item md={12} xs={12}>
                  <Typography variant='body1' fontWeight='500' color='primary'>
                    Timezone <span style={{ color: 'red' }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      control={control}
                      name='timezone'  // assuming 'timezone' is the name you want to use
                      defaultValue={filteredTimezones[config.timezoneIndex]}
                      render={({ field }) => (
                        <Autocomplete
                          options={timezones}
                          id='autocomplete-limit-tags'
                          getOptionLabel={option => option.offset}
                          value={config.timezone}
                          onChange={(e, v) => handleConfiguration('timezone', v)}
                          error={Boolean(errors.timezone)}
                          renderInput={params => (
                            <TextField {...params} label='Timezone' error={config.timezone == null} />
                          )}
                        />
                      )}
                    />
                    {errors.timezone && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.timezone.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>

      {!hidden && (
        <Grid container xs={12} sm={6} md={6} lg={6}>
          <img
            src={
              theme.palette.mode === 'dark'
                ? '/images/pages/auth-v2-forgot-password-illustration-dark.png'
                : '/images/pages/auth-v2-forgot-password-illustration-light.png'
            }
            alt='leanprofit-configuration-image'
            width='90%'
            style={{ margin: 'auto' }}
          />
        </Grid>
      )}
    </Grid>
  )
}

export default SettingsConfig
