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
  deleteHRApproval,
  setConfigs,
  setHRApprovals
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
import { addUser, fetchUsers } from 'src/store/apps/user'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { handleResponse } from 'src/helpers/helpers'

const defaultValues = {
  startWeekDay: '',
  endWeekDay: '',
  currency: '',
  timezone: ''
}

const schema = yup.object().shape({
  startWeekDay: yup.string().required('Start day is required'),
  endWeekDay: yup.string().required('End day is required'),
  currency: yup.object().required('Currency is required'),
  timezone: yup.object().required('Timezone is required')
})

const SettingsConfig = () => {
  const { configuration, OrgHrApprove, HrApprovals } = useSelector(state => state.settings)
  const dispatch = useDispatch()
  const _userStore = useSelector(state => state.user)

  const [HRs, setHRs] = useState({
    users: [],
    selectedHRs: [],
    newHRs: [],
    deleteHRs: []
  })

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

  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDatum = async () => {
      dispatch(await fetchConfig())
      dispatch(await fetchHRApprovals())
      dispatch(await fetchUsers()).then(res => setLoading(false))
    }

    fetchDatum()
  }, [])

  useEffect(() => {
    if (configuration != null && Object.keys(configuration).length > 0) {
      const currency = currencies.findIndex(o => o.cc == configuration.currency)
      const time = timezones.findIndex(o => o.offset == configuration.timeZone?.split(' - ')[1])
      const HRs = _userStore.users.filter(u => HrApprovals.some(o => o.userId === u.id))
      const users = _userStore.users.filter(u => !HRs.includes(u))
      setHRs(state => ({ ...state, selectedHRs: HRs, users: users }))
      reset({
        currency: currency == -1 ? '' : currencies[currency],
        timezone: time == -1 ? '' : timezones[time],
        endWeekDay: configuration.workingdays?.split('-')[1],
        startWeekDay: configuration.workingdays?.split('-')[0]
      })
    }
  }, [HrApprovals, _userStore.users, configuration])

  const updateOrgSettings = newConfig => {
    dispatch(setConfigs(newConfig))
  }

  //Save Configure

  const handleSaveSettings = request => {
    setLoading(true)
    if (configuration != null && Object.keys(configuration).length > 0) {
      const req = settingsRequest(request)
      dispatch(putConfig({ id: configuration.id, ...req }))
        .then(unwrapResult)
        .then(res => {
          handleResponse('update', res, updateOrgSettings)
          setLoading(false)
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

    handleHRApproval()
  }

  const updateHRApprovalState = data => {
    const approvals = [...HRs.selectedHRs]
    setHRs(state => ({ ...state, newHRs: [], selectedHRs: approvals }))
  }

  //Handle HR Approval

  const handleHRApproval = () => {
    if (HRs.newHRs.length > 0) {
      const id = HRs.newHRs.map(o => o.id)
      dispatch(postHRApproval(id))
        .then(unwrapResult)
        .then(res => {
          handleResponse('create', res.data, updateHRApprovalState)
          setLoading(false)
        })
    }

    if (HRs.deleteHRs.length > 0) handleDelete()
  }

  // Map Configuration

  const collectDeletingHRs = data => {
    const restHRs = [...HRs.selectedHRs]
    const deleteHRs = HRs.deleteHRs.length > 0 ? [...HRs.deleteHRs, data] : [data]
    const index = restHRs.findIndex(o => o.id == data.id)
    index != -1 && restHRs.splice(index, 1)
    // HRs.users.push(data)
    setHRs(state => ({ ...state, users: HRs.users, deleteHRs: deleteHRs, selectedHRs: restHRs }))
  }

  const collectNewHRs = data => {
    let newUsers = []
    const deleted = [...HRs.deleteHRs]
    const addedUser = data[data.length - 1]

    const updatedUsers = HRs.users.filter(o => o.id != addedUser.id)

    if (!HRs.selectedHRs.includes(addedUser) && !deleted.includes(addedUser)) {
      if (HRs.newHRs.length > 0) newUsers = [...HRs.newHRs, addedUser]
      else newUsers.push(addedUser)
    }

    if (deleted.includes(addedUser)) {
      const index = deleted.findIndex(o => o.id == addedUser.id)
      deleted.splice(index, 1)
    }

    setHRs({ newHRs: newUsers, users: updatedUsers, deleteHRs: deleted, selectedHRs: data })
  }

  const deleteHRState = data => {
    // const approvals = HrApprovals.filter(u => data.some(t => t == u.id))
    // const users = _userStore.users.filter(u => approvals.some(t => t.userId != u.id))
    // setHRs(state => ({ ...state, users: users, selectedHRs: approvals }))
  }

  //handle delete
  const handleDelete = () => {
    const approvals = HrApprovals.filter(o => HRs.deleteHRs.some(d => d.id == o.userId))
    const ids = approvals.map(o => o.id)
    if (ids != null) {
      dispatch(deleteHRApproval(ids))
        .then(unwrapResult)
        .then(res => {
          handleResponse('delete', res.data, deleteHRState, ids)
          setHRs(state => ({ ...state, deleteHRs: [] }))
          setLoading(false)
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
                      name='startWeekDay'
                      render={({ field }) => (
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          label='Start Date *'
                          {...field}
                          error={Boolean(errors.startWeekDay)}
                        >
                          {WEEKDAYS.map((day, i) => (
                            <MenuItem key={i} value={day} disabled={watch('endWeekDay') === day}>
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
                          label='End Date *'
                          {...field}
                          error={Boolean(errors.endWeekDay)}
                        >
                          {WEEKDAYS.map((day, i) => (
                            <MenuItem key={i} value={day} disabled={watch('startWeekDay') === day}>
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
                      render={({ field }) => (
                        <Autocomplete
                          options={currencies}
                          id='autocomplete-limit-tags'
                          getOptionLabel={o => `${o.name} - ${o.cc}`}
                          onChange={(e, data) => field.onChange(data)}
                          value={field.value}
                          error={Boolean(errors.currency)}
                          renderInput={params => <TextField {...params} label='Currency' />}
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
                    <Controller
                      control={control}
                      name='timezone'
                      render={({ field }) => (
                        <Autocomplete
                          options={timezones}
                          id='autocomplete-limit-tags'
                          getOptionLabel={o => `${o.name} - ${o.offset}`}
                          value={field.value}
                          onChange={(e, data) => field.onChange(data)}
                          error={Boolean(errors.timezone)}
                          renderInput={params => (
                            <TextField {...params} label='Timezone' error={errors.timezone} />
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

                {/* HR */}

                <Grid item md={12} xs={12}>
                  <Typography variant='body1' fontWeight='500' color='primary'>
                    HR Approval <span style={{ color: 'red' }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <CustomHRPicker
                      items={HRs.users}
                      values={HRs.selectedHRs}
                      label='Users'
                      name='hr'
                      HRs={HrApprovals}
                      onDelete={collectDeletingHRs}
                      onSelect={collectNewHRs}
                      originalItems={_userStore.users}
                    />

                    {errors.hr && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.hr.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} className='flex-right'>
                  <Button type='submit' variant='contained' color='primary'>
                    Submit
                  </Button>
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
