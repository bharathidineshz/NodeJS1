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
  Avatar,
  Checkbox,
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
  postCategory,
  setCategories,
  setEditTask,
  setEmpty,
  setNewTask,
  setTaskLists
} from 'src/store/apps/projects'
import { formatLocalDate } from 'src/helpers/dateFormats'
import toast from 'react-hot-toast'
import { categoryRequest } from 'src/helpers/requests'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { handleResponse } from 'src/helpers/helpers'
import { unwrapResult } from '@reduxjs/toolkit'
import { setLoading } from 'src/store/authentication/register'
import { customErrorToast } from 'src/helpers/custom-components/toasts'

const NewTaskCategory = ({ isOpen, setOpen }) => {
  const [categoryName, setCategoryName] = useState(null)
  const [isBillable, setBillable] = useState(true)
  const [isError, setError] = useState(false)
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)

  const STATUS = ['Completed', 'Not Started', 'Working on it', 'Due']
  const STATUS_COLOR = ['success', 'warning', 'info', 'error']

  //update state

  const updateTaskCategoryState = newCategory => {
    let taskList = [...store.taskLists]
    taskList.push({
      taskCategoryId: newCategory.id,
      taskCategory: newCategory.name,
      tasks: []
    })
    dispatch(setTaskLists(taskList))
  }

  //CREATE
  const createNewCategory = () => {
    try {
      if (categoryName) {
        setOpen(false)
        const projectId = Number(localStorage.getItem('projectId'))
        const request = categoryRequest(categoryName, isBillable, projectId)
        dispatch(postCategory(request))
          .then(unwrapResult)
          .then(res => {
            handleResponse('create', res, updateTaskCategoryState)
          })
      } else {
        setError(true)
      }
    } catch (error) {
      customErrorToast(error.message)
    }
  }

  //UPDATE
  const updateTask = () => {
    try {
      const tasks = [...store.taskLists]
      let index = tasks.findIndex(o => o.id === localNewTask.id)
      if (index != -1)
        tasks[index] = { ...localNewTask, dueDate: formatLocalDate(localNewTask.dueDate) }
      dispatch(setTaskLists(tasks))
      dispatch(setEditTask({}))
      setOpen(false)
      toast.success('Task Updated', { duration: 3000, position: 'top-right' })
    } catch (error) {
      toast.error(error, { duration: 3000, position: 'top-right' })
    }
  }

  return (
    <Box>
      <Drawer anchor='right' open={isOpen} onClose={() => setOpen(false)}>
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5} sx={{ p: 8, width: 420 }}>
            <Grid item xs={12} className='gap-1' justifyContent='space-between' alignItems='center'>
              <Typography color='secondary'>Add New Category</Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Category'
                value={categoryName}
                placeholder='Category Name'
                onChange={e => {
                  setCategoryName(e.target.value), e.target.value.length > 0 && setError(false)
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Icon icon='mdi:shape-outline' />
                    </InputAdornment>
                  )
                }}
              />
              {(isError || categoryName == '') && (
                <FormHelperText sx={{ color: 'error.main' }}>Category is required</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                label='Billable'
                control={
                  <Checkbox
                    defaultChecked={isBillable}
                    value={isBillable}
                    onChange={() => setBillable(!isBillable)}
                    name='color-primary'
                  />
                }
              />
            </Grid>

            <Grid columnGap={2} item xs={12} className='flex-right' sx={{ mt: 5 }}>
              <Button
                size='large'
                variant='outlined'
                color='secondary'
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
              <Button size='large' variant='contained' onClick={createNewCategory}>
                Add category
              </Button>
            </Grid>
          </Grid>
        </form>
      </Drawer>
    </Box>
  )
}

export default NewTaskCategory
