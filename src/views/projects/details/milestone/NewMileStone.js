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
  ListItemText,
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
  fetchMileStones,
  postMileStone,
  putMilestone,
  setCategories,
  setEditMilestone,
  setEditTask,
  setEmpty,
  setMileStones,
  setNewTask,
  setTaskLists
} from 'src/store/apps/projects'
import { formatLocalDate } from 'src/helpers/dateFormats'
import toast from 'react-hot-toast'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { mileStoneRequest } from 'src/helpers/requests'
import { unwrapResult } from '@reduxjs/toolkit'
import CustomCategoryPicker from 'src/views/components/autocomplete/CustomCategoryPicker'
import dayjs from 'dayjs'
import { handleResponse } from 'src/helpers/helpers'

var isBetween = require('dayjs/plugin/isBetween')

dayjs.extend(isBetween)

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
}

const defaultValues = {
  name: '',
  description: '',
  startDate: null,
  endDate: null,
  categories: []

}

const schema = yup.object().shape({
  name: yup.string().required('Milestone name is required'),
  description: yup.string().notRequired(),
  startDate: yup.date().required('Start Date is required'),
  endDate: yup.date().required('End Date is required'),
  // categories: yup.string().required('Categories is required')
})

const NewMileStone = ({ isOpen, setOpen }) => {
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)


  const { mileStones, editMilestone } = useSelector(state => state.projects)

  const [milestone, setMilestone] = useState({
    milestoneName: '',
    startDate: '',
    endDate: '',
    categories: [],
    categoryList: []
  })

  const [maxDate, setMaxDate] = useState(null)
  const [minDate, setMinDate] = useState(null)

  useEffect(() => {
    setMilestone({ ...milestone, categoryList: store.categories })
  }, [store.categories])

  const {
    register,
    reset,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })


  useEffect(() => {
    setMilestone({ ...milestone, categoryList: store.categories })


    if (editMilestone) {
      reset({
        name: editMilestone.name,
        description: editMilestone.description,
        startDate: new Date(editMilestone.startDate),
        endDate: new Date(editMilestone.endDate),

      })
      setMilestone(ms => ({ ...ms, categories: editMilestone.taskCategories }))

    } else {
      reset({})
      setMilestone(ms => ({ ...ms, categories: [] }))

    }
  }, [editMilestone])

  const STATUS = ['Completed', 'Not Started', 'Working on it', 'Due']
  const STATUS_COLOR = ['success', 'warning', 'info', 'error']

  //CREATE

  const Proj = newReq => {
    setOpen(false);
    reset();
    dispatch(fetchMileStones(localStorage.getItem('projectId')));
    toast.success(`M${store.mileStones.length + 1} Created`, {
      duration: 3000,
      position: 'top-right'
    });
  }
  const onSubmit = data => {

    const error = mileStones.some(item => {

      if (editMilestone && item.id === editMilestone.id) {
        return false;
      }
      const isStartDateOverlap = dayjs(data.startDate).isBetween(
        dayjs(item.startDate),
        dayjs(item.endDate),
        null,
        '[)'
      );
      const isEndDateOverlap = dayjs(data.endDate).isBetween(
        dayjs(item.startDate),
        dayjs(item.endDate),
        null,
        '(]'
      );
      const ExistingDate = isStartDateOverlap || isEndDateOverlap;

      const isExistInNew = dayjs(item.startDate).isBetween(
        dayjs(data.startDate),
        dayjs(data.endDate),
        null,
        '[]'
      ) || dayjs(item.endDate).isBetween(
        dayjs(data.startDate),
        dayjs(data.endDate),
        null,
        '[]'
      );

      return ExistingDate || isExistInNew;
    });

    if (error) {
      toast.error('Milestone date range overlaps with an existing milestone');
    } else {
      try {
        const req = {
          projectId: localStorage.getItem('projectId'),
          taskCategories: milestone.categories.map(o => o.id),
          ...data
        };


        const request = mileStoneRequest(req);
        // const action = editMilestone ? putMilestone({ ...request, id: editMilestone.id }) : postMileStone(request);
        if (editMilestone) {
          dispatch(putMilestone({ ...request, id: editMilestone.id }))
            .then(unwrapResult)
            .then(res => {
              handleResponse('update', res, Proj)
            }).catch(error => toast.error(error, { duration: 3000, position: 'top-right' }));
        } else {
          dispatch(postMileStone(request))
            .then(unwrapResult)
            .then(res => {
              handleResponse('create', res.data, Proj)

            });
        }
      } catch (error) {
        toast.error(error, { duration: 3000, position: 'top-right' });
      }
    }
  };


  //UPDATE
  const updateTask = () => {
    try {
      const tasks = [...store.taskLists]
      let index = tasks.findIndex(o => o.id === localNewTask.id)
      if (index != -1)
        tasks[index] = { ...localNewTask, dueDate: formatLocalDate(localNewTask.dueDate) }
      dispatch(setTaskLists(tasks))
      dispatch(setEditTask({}))
      reset()
      setOpen(false)
      toast.success('Task Updated', { duration: 3000, position: 'top-right' })
    } catch (error) {
      toast.error(error, { duration: 3000, position: 'top-right' })
    }
  }

  //CLOSE

  const handleClose = () => {
    setOpen(false)
    // dispatch(setEditMilestone(null))
    !editMilestone ?
      setMilestone(ms => ({ ...ms, categories: [], categoryList: store.categories })) :
      // setMilestone(ms => ({ ...ms, categories: [], categoryList: [] }))
      reset()
  }


  // SET FIELDS

  const handleChangeCategory = categories => {
    setMilestone(ms => ({ ...ms, categories: categories }))
  }
  const handleItems = items => {
    setMilestone(ms => ({ ...ms, categoryList: items }))
  }
  const handleFromDateChange = selectedDate => {
    // Set the "to date" value when "from date" changes
    setValue('endDate', selectedDate)
  }

  useEffect(() => {
    setMinDate(new Date(JSON.parse(localStorage.getItem('project')).startDate)) //Project start date
    setMaxDate(new Date(JSON.parse(localStorage.getItem('project')).endDate)) //Project ENd date
  }, [])


  const currentYear = new Date().getFullYear()
  //const minDate = new Date(currentYear, 0, 1)

  return (
    <Box>
      <Drawer anchor='right' open={isOpen} onClose={() => handleClose()}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5} sx={{ p: 8, width: 420 }}>
            <Grid item xs={12} className='gap-1' justifyContent='space-between' alignItems='center'>
              <Typography color='secondary'>{editMilestone ? `Update Milestone` : `Add Milestone (M${store.mileStones?.length + 1
                })`}</Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      label='Milestone'
                      value={value}
                      placeholder='Milestone Name'
                      onChange={onChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Icon icon='mdi:flag-triangle' />
                          </InputAdornment>
                        )
                      }}
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

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='description'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      multiline
                      label='Description'
                      value={value}
                      placeholder='Description'
                      onChange={onChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Icon icon='mdi:order-bool-descending' />
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
              <DatePickerWrapper>
                <FormControl fullWidth>
                  <Controller
                    name='startDate'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        id='picker-filter-from-date'
                        selected={value}
                        popperPlacement='bottom'
                        // minDate={minDate}
                        // maxDate={maxDate}
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
                    )}
                  />
                  {errors.startDate && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.startDate.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </DatePickerWrapper>
            </Grid>

            <Grid item xs={12}>
              <DatePickerWrapper>
                <FormControl fullWidth>
                  <Controller
                    name='endDate'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        id='picker-filter-from-date'
                        selected={value}
                        popperPlacement='bottom'
                        onChange={onChange}
                        // minDate={watch('startDate')}
                        // maxDate={maxDate}
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
                    )}
                  />
                  {errors.endDate && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.endDate.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </DatePickerWrapper>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='categories'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomCategoryPicker
                      label='Categories'
                      items={
                        milestone.categoryList
                      }
                      values={milestone.categories}
                      setCategories={handleChangeCategory}
                      originalItems={store.categories}
                      setItems={handleItems}
                    />
                  )}
                />

              </FormControl>
            </Grid>

            <Grid columnGap={2} item xs={12} className='flex-right' sx={{ mt: 5 }}>
              <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
                Close
              </Button>
              <Button size='large' variant='contained' type='submit'>
                {editMilestone ? 'Update Milestone' : ' Add Milestone'}

              </Button>
            </Grid>
          </Grid>
        </form>
      </Drawer>
    </Box>
  )
}

export default NewMileStone