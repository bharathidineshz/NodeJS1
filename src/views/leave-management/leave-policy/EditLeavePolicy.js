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
import { putPolicy, setApply } from 'src/store/leave-management'
import { useEffect } from 'react'
import { Box } from '@mui/system'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import PickersComponent from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { customToast, errorToast, successToast } from 'src/helpers/helpers'
import { useTheme } from '@emotion/react'
import { postProject } from 'src/store/apps/projects'
import { leavePolicyRequest } from 'src/helpers/requests'

const schema = yup.object().shape({
  typeOfLeave: yup.string().required('Request Type is Required'),
  count: yup.number().required('Count should be greater than 0'),
  period: yup.string().required('Period is Required'),
  carryForward: yup.boolean(),
  carryForwardCount: yup.number()
})

const EditLeavePolicy = ({ isOpen, setOpen, row }) => {
  const dispatch = useDispatch()
  const store = useSelector(state => state.leaveManagement)
  const theme = useTheme()

  const {
    reset,
    control,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: row
      ? {
          typeOfLeave: row?.typeOfLeave,
          count: row?.leaveCount,
          period: row?.period,
          carryForward: row?.carryForward,
          carryForwardCount: row?.carryForwardCount
        }
      : {
          typeOfLeave: '',
          count: '',
          period: '',
          carryForward: '',
          carryForwardCount: ''
        },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    reset({
      typeOfLeave: row?.typeOfLeave,
      count: row?.leaveCount,
      period: row?.period,
      carryForward: row?.carryForward,
      carryForwardCount: row?.carryForwardCount
    })
  }, [row])

  const isWeekday = date => {
    const day = new Date(date).getDay()

    return day !== 0 && day !== 6
  }

  //submit

  const onSubmit = () => {
    try {
      const req = { id: row?.id, ...watch() }
      dispatch(putPolicy(leavePolicyRequest(req)))
      setOpen(false)
      successToast('Leave Policy Created')
    } catch (error) {
      errorToast(error)
    }
    reset({
      typeOfLeave: '',
      count: '',
      period: '',
      carryForward: '',
      carryForwardCount: ''
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
            <Typography variant='h5'>Edit Leave Policy</Typography>
          </Box>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='typeOfLeave'
                  control={control}
                  rules={{ required: true }}
                  render={field => (
                    <TextField label='Policy Type' {...field} error={Boolean(errors.typeOfLeave)} />
                  )}
                />
                {errors.typeOfLeave && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.typeOfLeave.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='count'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      type='number'
                      label='Policy Count'
                      onChange={onChange}
                      error={Boolean(errors.count)}
                    />
                  )}
                />
                {errors.count && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.count.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
                <FormControl fullWidth>
                  <InputLabel id='demo-select-small-label'>Period</InputLabel>
                  <Controller
                    name='period'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        value={value}
                        label='Period'
                        onChange={onChange}
                        error={Boolean(errors.period)}
                        labelId='demo-select-small-label'
                        aria-describedby='stepper-linear-client'
                      >
                        {[
                          { id: '1', name: 'Monthly' },
                          { id: '2', name: 'Yearly' }
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
              <FormControl>
                <Controller
                  name='carryForward'
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <FormControlLabel
                      control={<Switch value={value} onChange={onChange} />}
                      label='Carry Forward'
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='carryForwardCount'
                  control={control}
                  rules={{ required: watch('carryForward') ? true : false }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      type='number'
                      label='Carry forward count'
                      disabled={watch('carryForward') ? false : true}
                      onChange={onChange}
                      error={Boolean(errors.carryForwardCount)}
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
          <Button variant='outlined' color='secondary' onClick={() => setOpen(false)}>
            Discard
          </Button>
          <Button variant='contained' type='submit' sx={{ mr: 1 }}>
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditLeavePolicy
