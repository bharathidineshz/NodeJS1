// ** React Imports
import React, { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import toast from 'react-hot-toast'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'

// import TableEditable from 'src/views/table/data-grid/TableEditable'
import TimeSheetTable from './timesheetTable'
import FormHelperText from '@mui/material/FormHelperText'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@mui/material'
import { Icon } from '@iconify/react'
import DatePicker from 'react-datepicker'
import timesheets, {
  fetchTaskData,
  fetchProjectData,
  postData,
  fetchData,
  fetchAssignedProject,
  fetchAssignedTask,
  setTimeSheets
} from 'src/store/timesheets/index'
import TimeSheetTextField from 'src/pages/timesheets/timesheet-steps/TimeSheetTextField'
import FallbackSpinner from 'src/@core/components/spinner'
import { unwrapResult } from '@reduxjs/toolkit'
import SimpleBackdrop from 'src/@core/components/spinner'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { ConvertHoursToTime, handleResponse } from 'src/helpers/helpers'
import { customErrorToast } from 'src/helpers/custom-components/toasts'

const TimesheetsDay = ({ popperPlacement }) => {
  const dispatch = useDispatch()
  const { taskData, projectData, data } = useSelector(state => state.timesheets)

  useEffect(() => {
    // setLoading(true)
    dispatch(fetchData())
    dispatch(fetchAssignedProject())
      .then(unwrapResult)
      .then(() => {
        setLoading(false)
      })
  }, [dispatch])

  const [date, setDate] = useState(new Date())
  const [selectedTask, setDescription] = useState('')
  const [timeInput, setTimeInput] = useState('')
  const [selectedValue, setSelectedValue] = useState(0)
  const [descriptionError, setDescriptionError] = useState(false)
  const [timeError, setTimeError] = useState(false)
  const [selectedValueError, setSelectedValueError] = useState(false)
  const [selectedProjectTasks, setSelectedProjectTasks] = useState([])
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedValue > 0) dispatch(fetchAssignedTask(selectedValue))
  }, [selectedValue])

  useEffect(() => {
    if (taskData.length > 0) {
      setSelectedProjectTasks(taskData.flatMap(o => o.tasks))
    }
  }, [taskData])

  const formatDateString = date => {
    if (date == null || date === '') {
      return new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 19)
        .concat('Z')
    } else {
      return new Date(new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 19)
        .concat('Z')
    }
  }

  const handleAutocompleteChange = (event, newValue) => {
    setDescription(newValue ? newValue : '')
  }

  const handleMenuItemClick = uniqueId => {
    setSelectedValue(uniqueId)
  }

  //Add new timeSheet
  const addNewTimeSheet = newTs => {
    const timeSheets = [...data]
    const updatedTimeSheets = [...timeSheets, newTs]
    dispatch(setTimeSheets(updatedTimeSheets))
  }

  const handleSubmit = () => {
    setDescriptionError(false)
    setTimeError(false)
    setSelectedValueError(false)

    // Checking each field and setting error states if empty
    if (!selectedTask) {
      setDescriptionError(true)
    }
    if (!timeInput) {
      setTimeError(true)
    }
    if (!selectedValue) {
      setSelectedValueError(true)
    }
    // const selectedTask = taskData.find(task => task.description === description)

    if (timeInput.split(':')[0] > 24) {
      customErrorToast('Hours Should be less than 24 hours')
      setDescription(selectedTask)

      return
    }

    const data = {
      id: 0,
      burnedHours:
        timeInput.split(':').length == 3
          ? timeInput
          : ConvertHoursToTime(isNaN(timeInput) ? timeInput : Number(timeInput)),
      timeSheetDate:
        date == null || '' || undefined ? new Date()?.toISOString() : formatDateString(date),
      isBillable: true,
      taskId: selectedTask?.id,
      projectId: selectedValue,
      taskCategoryId: selectedTask?.taskCategoryId
    }

    if (selectedTask && timeInput && selectedValue) {
      try {
        dispatch(postData(data))
          .then(unwrapResult)
          .then(res => {
            handleResponse('create', res, addNewTimeSheet)
            setLoading(false)
          })
        setDescription('')
        setTimeInput('')
        setSelectedValue('')
      } catch (error) {
        toast.error(error)
        setLoading(false)
      }
    }
  }

  //hours

  const handleSaveHours = e => {
    if (e.key === 'Enter') {
      const burns = isNaN(e.target.value) ? e.target.value : Number(e.target.value)
      const hours = ConvertHoursToTime(burns)
      setTimeInput(hours)
    }
  }

  return (
    <Grid className='gap-1' flexDirection='column'>
      <Card sx={{ pt: 2, pb: 2 }}>
        <CardContent>
          <Grid container spacing={3} justifyContent='space-evenly'>
            {/* Button */}
            <Grid item xs={12} sm={2.5} md={2.5}>
              <FormControl fullWidth size='small'>
                <InputLabel id='demo-simple-select-helper-label'>Projects</InputLabel>
                <Select
                  label='Projects'
                  defaultValue=''
                  value={selectedValue}
                  onChange={event =>
                    handleMenuItemClick(event.target.value, event.target.innerText)
                  }
                >
                  {projectData?.length === 0 || !projectData ? (
                    <MenuItem disabled>No Projects</MenuItem>
                  ) : (
                    projectData?.map(project => (
                      <MenuItem
                        key={project?.projectId}
                        value={project?.projectId}
                        onClick={() => handleMenuItemClick(project?.projectId)}
                      >
                        {project?.projectName ? project?.projectName : 'NO Data'}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
              {selectedValueError && !selectedValue && (
                <FormHelperText sx={{ color: 'error.main', position: 'absolute' }}>
                  Please select a value
                </FormHelperText>
              )}{' '}
            </Grid>

            {/* Autocomplete */}
            <Grid item xs={12} sm={5} md={5}>
              <Autocomplete
                fullWidth
                size='small'
                options={selectedProjectTasks}
                getOptionLabel={option => option?.description || ''}
                value={selectedTask}
                onChange={handleAutocompleteChange}
                noOptionsText='No Tasks'
                renderInput={params => <TextField {...params} label='Description' />}
              />
              {descriptionError && !selectedTask && (
                <FormHelperText sx={{ color: 'error.main', position: 'absolute' }}>
                  Please fill Description
                </FormHelperText>
              )}{' '}
            </Grid>
            {/* DatePicker */}
            <Grid item xs={12} sm={1.5} md={1.5}>
              <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
                <DatePicker
                  todayButton='Today'
                  selected={date}
                  id='basic-input'
                  popperPlacement={popperPlacement}
                  onChange={date => setDate(date)}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput label='Date' size='small' />}
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={12} sm={1.5} md={1.5}>
              <TextField
                value={timeInput}
                size='small'
                onKeyDown={handleSaveHours}
                onChange={e => setTimeInput(e.target.value)}
              />
              {timeError && !timeInput && (
                <FormHelperText sx={{ color: 'error.main', position: 'absolute' }}>
                  Please fill Time
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sm={1} md={1} className='d-flex' justifyContent='space-evenly'>
              <Button fullWidth variant='contained' size='medium' onClick={handleSubmit}>
                Add
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <Box>
          {isLoading ? (
            <SimpleBackdrop />
          ) : (
            <Grid item xs={12}>
              <TimeSheetTable loading={isLoading} />
            </Grid>
          )}
        </Box>
      </Card>
    </Grid>
  )
}

export default TimesheetsDay
