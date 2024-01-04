// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import CustomChip from 'src/@core/components/mui/chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import {
  Autocomplete,
  Avatar,
  Chip,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Typography
} from '@mui/material'

//** Third Party */
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTasks,
  fetchUsers,
  postTask,
  putTask,
  setEditTask,
  setNewTask,
  setTaskLists
} from 'src/store/apps/projects'
import { formatLocalDate } from 'src/helpers/dateFormats'
import toast from 'react-hot-toast'
import { unwrapResult } from '@reduxjs/toolkit'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { fetchStatus } from 'src/store/absence-management'
import { taskRequest } from 'src/helpers/requests'
import { STATUS, TASK_PRIORITIES } from 'src/helpers/constants'

const defaultValues = {
  description: '',
  taskStatusId: 1,
  taskEstimatedHours: '',
  dueDate: new Date(),
  taskAssignedUserId: 0,
  taskPriorityId: 1,
  isBillable: true
}

const schema = yup.object().shape({
  description: yup.string().required('task is required'),
  taskStatusId: yup.number().notRequired(),
  taskEstimatedHours: yup.string().max(8).required('Estimated hours is required'),
  dueDate: yup.date().required('Due Date Reaquired'),
  taskAssignedUserId: yup.number().required('Task Owner required'),
  taskPriorityId: yup.number().positive().required('Priority is required'),
  isBillable: yup.boolean()
})

const NewTask = ({ isOpen, setOpen }) => {
  const [assignees, setAssignees] = useState([])
  const [index, setIndex] = useState(0)

  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)
  const _leaveStore = useSelector(state => state.leaveManagement)

  useEffect(() => {
    dispatch(fetchStatus())
    dispatch(fetchUsers())
      .then(unwrapResult)
      .then(res => {
        setAssignees(store.users)
        reset({
          taskPriorityId: 1,
          taskStatusId: 1
        })
      })
  }, [])
  useEffect(() => {
    if (store.editTask !== null && Object.keys(store.editTask).length > 0) {
      const {
        description,
        taskStatusId,
        taskPriorityId,
        taskEstimatedHours,
        dueDate,
        taskAssignedUserId,
        isBillable
      } = store.editTask
      reset({
        description: description,
        dueDate: dueDate,
        isBillable: isBillable,
        taskAssignedUserId: taskAssignedUserId,
        taskEstimatedHours: taskEstimatedHours,
        taskPriorityId: taskPriorityId,
        taskStatusId: taskStatusId
      })
      const _index =
        store.users?.length > 0 && store.users.findIndex(o => o.id === taskAssignedUserId)
      setIndex(_index)
    }
  }, [store.editTask])

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

  //UPDATE

  const onSubmit = data => {
    const category = JSON.parse(localStorage.getItem('category'))
    const tasks = category.tasks.flatMap(o => o.description?.trim()?.toLowerCase())

    if (tasks.includes(data.description?.trim().toLowerCase())) {
      return toast.error('Task Already exist in this category')
    }

    const projId = Number(localStorage.getItem('projectId'))
    const _category = JSON.parse(localStorage.getItem('category'))
    const request = taskRequest({
      id: store.editTask ? store.editTask.id : 0,
      taskCategoryId: _category?.taskCategoryId,
      projectId: projId,
      ...data
    })
    dispatch(
      store.editTask || Object.keys(store.editTask).length > 0
        ? putTask(request)
        : postTask(request)
    )
      .then(unwrapResult)
      .then(res => {
        if (res.status === 200) {
          dispatch(fetchTasks(projId)).then(() => {
            toast.success(res.data)
            setOpen(false)
            reset({
              taskPriorityId: 1,
              taskStatusId: 1
            })
          })
        } else {
          toast.error(res.data)
        }
      })
  }

  return (
    <Box>
      <Drawer anchor='right' open={isOpen} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6} sx={{ p: 8, width: 500 }}>
            <Grid item xs={12} className='gap-1' justifyContent='space-between' alignItems='center'>
              <Typography color='secondary'>Add New task</Typography>
              <CustomChip label={store.selectedCategory} skin='light' color='primary' />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='description'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      label='Task *'
                      value={value}
                      placeholder='Task Name'
                      onChange={onChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Icon icon='mdi:checkbox-marked-circle-auto-outline' />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
                {errors.description && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.description.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-outlined-label' required>
                  Status
                </InputLabel>
                <Controller
                  name='taskStatusId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      required
                      label='Status'
                      id='demo-simple-select-outlined'
                      labelId='demo-simple-select-outlined-label'
                      value={value}
                      defaultValue={1}
                      onChange={onChange}
                      startAdornment={
                        <InputAdornment position='start'>
                          <Icon icon='mdi:list-status' />
                        </InputAdornment>
                      }
                    >
                      {STATUS.map((status, i) => (
                        <MenuItem key={i} className='gap-1' value={status.id}>
                          <CustomChip
                            key={i}
                            label={status.name}
                            skin='light'
                            color={status.color}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.taskStatusId && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.taskStatusId.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-outlined' required>
                  Priority
                </InputLabel>
                <Controller
                  name='taskPriorityId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      required
                      label='Priority'
                      id='demo-simple-outlined'
                      labelId='demo-simple-select-outlined'
                      value={value}
                      defaultValue={1}
                      onChange={onChange}
                      startAdornment={
                        <InputAdornment position='start'>
                          <Icon icon='mdi:priority-high' />
                        </InputAdornment>
                      }
                    >
                      {TASK_PRIORITIES.map((prior, i) => (
                        <MenuItem key={i} className='gap-1' value={prior.id}>
                          <CustomChip key={i} label={prior.name} skin='light' color={prior.color} />
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.taskPriorityId && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.taskPriorityId.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='dueDate'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <DatePickerWrapper>
                      <DatePicker
                        id='picker-filter-from-date'
                        selected={value}
                        popperPlacement='auto'
                        onChange={onChange}
                        autoComplete='off'
                        customInput={
                          <CustomInput
                            label='Due Date *'
                            fullWidth
                            autocom
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
                {errors.dueDate && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.dueDate.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='taskEstimatedHours'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      value={value}
                      onChange={onChange}
                      label='Estimated Hours *'
                      placeholder='Estimated Hours'
                      helperText='eg: 08:00'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Icon icon='mdi:clock-outline' />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
                {errors.taskEstimatedHours && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.taskEstimatedHours.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='taskAssignedUserId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Autocomplete
                      options={assignees}
                      id='autocomplete-limit-tags'
                      getOptionLabel={option => option.userName || ''}
                      value={store.editTask ? assignees[index] : value}
                      onChange={(event, value) => {
                        field.onChange(value.id)
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={Boolean(errors.taskAssignedUserId)}
                          label='Task owner *'
                          placeholder='Owner'
                        />
                      )}
                    />
                  )}
                />
                {errors.taskAssignedUserId && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.taskAssignedUserId.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl sx={{ mb: 6 }}>
                <Controller
                  name='isBillable'
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <FormControlLabel
                      control={
                        <Switch checked={value} defaultChecked={value} onChange={onChange} />
                      }
                      label='Billable'
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

            <Grid columnGap={2} item xs={12} className='flex-right' sx={{ mt: 5 }}>
              <Button
                size='large'
                variant='outlined'
                color='secondary'
                onClick={() => {
                  setOpen(false),
                    reset({
                      taskPriorityId: 1,
                      taskStatusId: 1
                    })
                }}
              >
                Close
              </Button>
              {Object.keys(store.editTask).length > 0 ? (
                <Button size='large' variant='contained' type='submit'>
                  Update Task
                </Button>
              ) : (
                <Button size='large' variant='contained' type='submit'>
                  Add Task
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </Drawer>
    </Box>
  )
}

export default NewTask
