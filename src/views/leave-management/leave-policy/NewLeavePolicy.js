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
import { fetchPolicies, postPolicy, setApply } from 'src/store/leave-management'
import { useEffect } from 'react'
import { Box } from '@mui/system'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import PickersComponent from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { customToast } from 'src/helpers/helpers'
import { useTheme } from '@emotion/react'
import { postProject } from 'src/store/apps/projects'
import { leavePolicyRequest } from 'src/helpers/requests'
import { unwrapResult } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { APPROVERS } from 'src/helpers/constants'

const defaultValues = {
  typeOfLeave: '',
  allowanceTime: 0,
  allowanceCount: 0,
  period: '',
  isPermission: false,
  carryForwardCount: 0,
  level1: 1,
  level2: 2
}

const schema = yup.object().shape({
  typeOfLeave: yup.string().required('Request Type is Required'),
  allowanceCount: yup.number().min(0).required('Allowance Required'),
  allowanceTime: yup.number().min(0),
  period: yup.string().required('Period is Required'),
  isPermission: yup.boolean(),
  carryForwardCount: yup.number().min(0),
  level1: yup.number().min(0).notRequired(),
  level2: yup.number().min(0).notRequired()
})

const NewLeavePolicy = ({ isOpen, setOpen }) => {
  const dispatch = useDispatch()
  const store = useSelector(state => state.leaveManagement)
  const theme = useTheme()

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

  const isWeekday = date => {
    const day = new Date(date).getDay()

    return day !== 0 && day !== 6
  }

  //submit

  const onSubmit = async formData => {
    const req = leavePolicyRequest(formData)
    dispatch(postPolicy(req))
      .then(unwrapResult)
      .then(res => {
        dispatch(fetchPolicies())
        setOpen(false)
        res.status === 200 || res.status === 201 ? toast.success(res.data) : toast.error(res.data)
        reset()
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
            <Typography variant='h5'>Add New Leave Policy</Typography>
          </Box>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='typeOfLeave'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Leave Type *'
                      placeholder='Leave Type'
                      onChange={onChange}
                      error={Boolean(errors.typeOfLeave)}
                    />
                  )}
                />
                {errors.typeOfLeave && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.typeOfLeave.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={5}>
              <FormControl fullWidth>
                <Controller
                  name='allowanceCount'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      type='number'
                      label='Allowance'
                      onChange={onChange}
                      error={Boolean(errors.allowance)}
                    />
                  )}
                />
                {errors.allowance && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.allowance.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid
              item
              xs={12}
              sm={2}
              display='flex'
              alignItems='center'
              justifyContent='space-evenly'
            >
              <Typography variant='body2'>Per</Typography>
            </Grid>

            <Grid item xs={12} sm={5}>
              <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
                <FormControl fullWidth>
                  <InputLabel id='demo-select-small-label'>Period *</InputLabel>
                  <Controller
                    name='period'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        value={value}
                        label='Period *'
                        onChange={onChange}
                        error={Boolean(errors.period)}
                        labelId='demo-select-small-label'
                        aria-describedby='stepper-linear-client'
                      >
                        {[
                          { id: '1', name: 'Month' },
                          { id: '2', name: 'Year' }
                        ].map(client => (
                          <MenuItem key={client.id} value={client.name}>
                            {client.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.period && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.period.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </DatePickerWrapper>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='carryForwardCount'
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <TextField value={value} label='Carry forward count' onChange={onChange} />
                  )}
                />
                {errors.carryForwardCount && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.carryForwardCount.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4} md={4} lg={4}>
              <FormControl>
                <Controller
                  name='isPermission'
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <FormControlLabel
                      label='Permission'
                      control={
                        <Checkbox
                          value={value}
                          checked={value}
                          onChange={onChange}
                          name='Permission'
                        />
                      }
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={8} md={8} lg={8}>
              <FormControl fullWidth>
                <Controller
                  name='allowanceTime'
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={watch('isPermission') ? value : 0}
                      type='number'
                      label='Hours'
                      disabled={!watch('isPermission')}
                      onChange={onChange}
                    />
                  )}
                />
                {(watch('isPermission') ? errors.hours : errors.days) && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {watch('isPermission') ? errors.hours.message : errors.days.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6}>
              <FormControl fullWidth>
                <InputLabel id='demo-select-small-label'>Level 1</InputLabel>
                <Controller
                  name='level1'
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={value}
                      label='Level 1'
                      onChange={onChange}
                      defaultValue={1}
                      labelId='demo-select-small-label'
                      aria-describedby='stepper-linear-client'
                    >
                      {APPROVERS.map(approver => (
                        <MenuItem key={approver.id} value={approver.id}>
                          {approver.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6}>
              <FormControl fullWidth>
                <InputLabel id='demo-select-small-label'>Level 2</InputLabel>
                <Controller
                  name='level2'
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={watch('level1') === 3 ? '' : value}
                      label='Level 2'
                      onChange={onChange}
                      defaultValue={2}
                      disabled={watch('level1') === 3}
                      labelId='demo-select-small-label'
                      aria-describedby='stepper-linear-client'
                    >
                      {APPROVERS.map(approver => (
                        <MenuItem key={approver.id} value={approver.id}>
                          {approver.name}
                        </MenuItem>
                      ))}
                    </Select>
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
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default NewLeavePolicy
