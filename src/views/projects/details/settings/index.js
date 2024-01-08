// ** React Imports
import { forwardRef, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Select from '@mui/material/Select'

// ** Third Party Imports

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import {
  Autocomplete,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Switch
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import CustomSkillPicker from 'src/views/components/autocomplete/CustomSkillPicker'
import { ORG_UNITS, SKILLS } from 'src/helpers/constants'
import { fetchSkills } from 'src/store/apps/user'
import CustomDepartmentPicker from 'src/views/components/autocomplete/CustomDepartmentPicker'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import {
  fetchClients,
  fetchProjectAssignees,
  putProject,
  setAssignees,
  fetchUsers,
  fetchDepartment
} from 'src/store/apps/projects'
import { unwrapResult } from '@reduxjs/toolkit'
import UserTable from '../../edit/UserTable'
import { Box, Stack } from '@mui/system'
import toast from 'react-hot-toast'
import { projectAssigneeRequest } from 'src/helpers/requests'
import CustomChip from 'src/@core/components/mui/chip'
import { handleResponse } from 'src/helpers/helpers'

const defaultValues = {
  client: 0,
  type: 2,
  name: '',
  plannedBudget: 0,
  plannedHours: 0,
  startDate: new Date(),
  endDate: new Date(),
  isBillable: true,
  allowUsersToChangeEstHours: false,
  allowUsersToCreateNewTask: false,
  department: 0
}

const schema = yup.object().shape({
  client: yup.number().required(),
  type: yup.number().required('Type required'),
  name: yup.string().required('Project name required'),
  plannedBudget: yup.number().positive().integer(),
  plannedHours: yup.number().positive().integer(),
  startDate: yup.date().notRequired(),
  endDate: yup.date().notRequired(),
  isBillable: yup.boolean().notRequired(),
  allowUsersToChangeEstHours: yup.boolean().notRequired(),
  allowUsersToCreateNewTask: yup.boolean().notRequired(),
  department: yup.string().required('Department is required')
})

const Settings = () => {
  // ** States
  const [clients, setClients] = useState([])
  const [skills, setSkills] = useState([])
  const [departments, setDepartments] = useState([])

  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)
  const userStore = useSelector(state => state.user)
  const [users, setUsers] = useState([])

  const [values, setValues] = useState({
    password: '',
    password2: '',
    showPassword: false,
    showPassword2: false
  })

  useEffect(() => {
    const _project = localStorage?.getItem('project')
    const project = JSON.parse(_project)
    const {
      clientId,
      name,
      projectTypeId,
      budget,
      departmentId,
      startDate,
      endDate,
      estimatedHours,
      isBillable,
      allowUsersToChangeEstHours,
      allowUsersToCreateNewTask,
      skillId
    } = project
    dispatch(fetchClients())
      .then(unwrapResult)
      .then(res => {
        reset({
          client: clientId,
          plannedBudget: budget,
          plannedHours: estimatedHours,
          endDate: endDate ? new Date(endDate) : new Date(),
          startDate: startDate ? new Date(startDate) : new Date(),
          allowUsersToChangeEstHours: allowUsersToChangeEstHours,
          allowUsersToCreateNewTask: allowUsersToCreateNewTask,
          isBillable: isBillable,
          department: departmentId,
          name: name,
          type: projectTypeId
        })
        setClients(res.result ?? [])
      })

    dispatch(fetchSkills())
      .then(unwrapResult)
      .then(res => {
        setSkills(res?.result?.filter(x => skillId?.includes(x.id)) ?? [])
      })
  }, [])

  useEffect(() => {
    dispatch(fetchUsers())

    dispatch(fetchDepartment())
  }, [dispatch])

  useEffect(() => {
    if (store.users?.length > 0 && store.users?.length > 0) {
      const _users = []
      store.users.forEach(user => {
        const isUserAssigned = store.assignees.find(o => o.userId === user.id)
        if (!isUserAssigned) {
          _users.push(user)
        }
      })
      setUsers(_users)
    }
  }, [store.users, store.assignees])

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

  const onChangeAssignees = (params, users) => {
    var assignees = users?.length == 0 ? [...store.assignees] : [...store.assignees, ...users]
    assignees = [...new Set(assignees)]
    dispatch(setAssignees(assignees))
  }

  const handleSkills = values => {
    setSkills(values)
  }
  //submit

  const onSubmit = data => {
    const request = {
      id: localStorage.getItem('projectId'),
      name: data.name,
      budget: data.plannedBudget,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
      estimatedHours: data.plannedHours,
      skillId: skills.length > 0 ? skills.map(o => o.id) : [],
      isActive: true,
      projectTypeId: data.type,
      clientId: data.client,
      departmentId: Number(data.department),
      isBillable: data.isBillable,
      allowUsersToChangeEstHours: data.allowUsersToChangeEstHours,
      allowUsersToCreateNewTask: data.allowUsersToCreateNewTask
    }

    dispatch(putProject(request))
      .then(unwrapResult)
      .then(res => {
        handleResponse('update', res, data => {
          localStorage.setItem('project', JSON.stringify(data))
        })
      })
      .catch(err => {
        toast.error(err.message)
      })
  }

  return (
    <Card>
      <CardHeader
        title='Update project details'
        action={
          <Button type='reset' size='large' color='error' variant='contained'>
            Archive
          </Button>
        }
      />
      <Divider sx={{ m: '0 !important' }} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. Client Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='stepper-linear-client'>Client</InputLabel>
                <Controller
                  name='client'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      fullWidth
                      label='Client'
                      labelId='stepper-linear-client'
                      aria-describedby='stepper-linear-client'
                      onChange={onChange}
                      value={value}
                      error={Boolean(errors.client)}
                    >
                      {clients?.map(client => (
                        <MenuItem key={client.id} value={client.id}>
                          {client.companyName}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.client && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.client.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ mb: '0 !important' }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                2. Project Details
              </Typography>
            </Grid>
            <Grid item xs={12} className='d-flex'>
              <FormControl fullWidth>
                <Controller
                  name='type'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <RadioGroup
                      row
                      aria-label='controlled'
                      name='controlled'
                      value={value}
                      onChange={onChange}
                    >
                      <FormControlLabel
                        disabled
                        value={2}
                        defaultChecked={value === 2}
                        control={<Radio />}
                        label='Fixed Price'
                      />
                      <FormControlLabel
                        disabled
                        value={1}
                        defaultChecked={value === 1}
                        control={<Radio />}
                        label='T & M'
                      />
                    </RadioGroup>
                  )}
                />
                {errors.type && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.type.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Project Name'
                      onChange={onChange}
                      placeholder='Enter Project Name'
                      error={Boolean(errors.name)}
                      aria-describedby='stepper-linear-project-name'
                    />
                  )}
                />
                {errors.name && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.name.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='plannedBudget'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Planned Budget'
                      type='number'
                      onChange={onChange}
                      placeholder='Enter Budget'
                      error={Boolean(errors.plannedBudget)}
                      aria-describedby='stepper-linear-project-budget'
                    />
                  )}
                />
                {errors.plannedBudget && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.plannedBudget.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='plannedHours'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Planned Hours'
                      type='number'
                      onChange={onChange}
                      placeholder='Enter Hours'
                      error={Boolean(errors.plannedHours)}
                      aria-describedby='stepper-linear-project-hours'
                    />
                  )}
                />
              </FormControl>
              {errors.plannedHours && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.plannedHours.message}
                </FormHelperText>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='file'
                label='Files'
                placeholder='Add Files'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Icon icon='mdi:file-outline' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='startDate'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <DatePickerWrapper>
                      <DatePicker
                        id='picker-filter-to-date'
                        selected={value}
                        popperPlacement='auto'
                        onChange={onChange}
                        customInput={
                          <CustomInput
                            label='Start Date'
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position='start'>
                                  <Icon icon='mdi:calendar-outline' />
                                </InputAdornment>
                              )
                            }}
                          />
                        }
                      />
                    </DatePickerWrapper>
                  )}
                />
                {errors.startDate && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.startDate.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='endDate'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <DatePickerWrapper>
                      <DatePicker
                        id='picker-filter-to-date'
                        selected={value}
                        popperPlacement='auto'
                        onChange={onChange}
                        customInput={
                          <CustomInput
                            label='End Date'
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position='start'>
                                  <Icon icon='mdi:calendar-outline' />
                                </InputAdornment>
                              )
                            }}
                          />
                        }
                      />
                    </DatePickerWrapper>
                  )}
                />
                {errors.endDate && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.endDate.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <CustomSkillPicker
                  values={skills}
                  items={userStore.skills.result || []}
                  label='Skills'
                  setSkills={handleSkills}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-outlined-label'>Department</InputLabel>
                  <Controller
                    name='department'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label='Department *'
                        id='demo-simple-select-outlined'
                        labelId='demo-simple-select-outlined-label'
                        required
                        value={value}
                        onChange={onChange}
                      >
                        {store.departments != null &&
                          store.departments.map((dept, i) => (
                            <MenuItem key={dept.id} className='gap-1' value={dept.id}>
                              <CustomChip
                                key={dept.id}
                                label={dept.name}
                                skin='light'
                                color='primary'
                              />
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                  {errors.department && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.department.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4} lg={4} md={4}>
              <FormControl>
                <Controller
                  name='isBillable'
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <FormControlLabel
                      control={<Switch defaultChecked={value} />}
                      value={value}
                      onChange={onChange}
                      label='IsBillable'
                      id='stepper-linear-project-isBillable'
                    />
                  )}
                />
                {errors.isBillable && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.isBillable.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} lg={4} md={4}>
              <FormControl>
                <Controller
                  name='allowUsersToCreateNewTask'
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <FormControlLabel
                      control={<Switch defaultChecked={value} />}
                      value={value}
                      onChange={onChange}
                      label='Allow Users To Create NewTask'
                      id='stepper-linear-project-isBillable'
                    />
                  )}
                />
                {errors.allowUsersToCreateNewTask && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.allowUsersToCreateNewTask.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} lg={4} md={4}>
              <FormControl>
                <Controller
                  name='allowUsersToChangeEstHours'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <FormControlLabel
                      control={<Switch defaultChecked={value} />}
                      value={value}
                      onChange={onChange}
                      label='Allow Users To Change Est.Hours'
                      id='stepper-linear-project-isBillable'
                    />
                  )}
                />
                {errors.allowUsersToChangeEstHours && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.allowUsersToChangeEstHours.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ mb: '20px !important' }} />
          </Grid>
        </CardContent>
        <Divider sx={{ m: '0 !important' }} />
        <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type='reset' size='large' color='secondary' variant='outlined'>
            Reset
          </Button>
          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
            Update Project
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default Settings
