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
import {
  fetchTaskData,
  fetchProjectData,
  postData,
  fetchData
} from 'src/store/apps/timesheets/index'
import TimeSheetTextField from 'src/pages/apps/timesheets/timesheet-steps/TimeSheetTextField'
import FallbackSpinner from 'src/@core/components/spinner'
import { unwrapResult } from '@reduxjs/toolkit'

const TimesheetsDay = ({ popperPlacement }) => {
  const dispatch = useDispatch()
  const { taskData, projectData } = useSelector(state => state.timesheets)

  useEffect(() => {
    dispatch(fetchData())
    dispatch(fetchTaskData())
    dispatch(fetchProjectData())
      .then(unwrapResult)
      .then(() => {
        setLoading(false)
      })
  }, [dispatch])

  const [date, setDate] = useState(new Date())
  const [description, setDescription] = useState('')
  const [timeInput, setTimeInput] = useState('')
  const [selectedValue, setSelectedValue] = useState('')
  const [descriptionError, setDescriptionError] = useState(false)
  const [timeError, setTimeError] = useState(false)
  const [selectedValueError, setSelectedValueError] = useState(false)
  const [selectedProjectTasks, setSelectedProjectTasks] = useState([])
  const [isLoading, setLoading] = useState(false)

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
    setDescription(newValue ? newValue.description : '')
  }

  const handleMenuItemClick = uniqueId => {
    setSelectedValue(uniqueId)

    const project = mappedUsers.find(proj => proj.projects.some(p => p.projectId === uniqueId))
    if (project) {
      const selectedProject = project.projects.find(p => p.projectId === uniqueId)

      if (selectedProject) {
        const tasks = selectedProject.taskCategories.flatMap(category => category.tasks)
        setSelectedProjectTasks(tasks)
      }
    }
  }

  const handleSubmit = () => {
    setDescriptionError(false)
    setTimeError(false)
    setSelectedValueError(false)
    setLoading(true)

    // Checking each field and setting error states if empty
    if (description === '') {
      setDescriptionError(true)
    }
    if (timeInput === '') {
      setTimeError(true)
    }
    if (selectedValue === '') {
      setSelectedValueError(true)
    }
    const selectedTask = taskData.find(task => task.description === description)

    // Creating a timesheet entry object
    const timesheetEntry = {
      tsMappingUid: '',
      predefinedTaskId: selectedTask ? selectedTask.uniqueId : '',
      date: date == null || '' || undefined ? new Date().toISOString() : formatDateString(date),
      time: timeInput.concat(':00'),
      category: selectedTask?.taskUniqueId ? selectedTask?.taskUniqueId : '',
      categoryName: selectedTask?.name ? selectedTask?.name : '',
      description: description
    }

    const payload = [
      {
        projectId: selectedValue,
        timesheet: [timesheetEntry]
      }
    ]

    if (description !== '' && timeInput !== '' && selectedValue !== '') {
      try {
        dispatch(postData(payload)).then(() => {
          setLoading(false)
        })
        setDescription('')
        setDate(new Date())
        setTimeInput('')
        setSelectedValue('')
      } catch (error) {
        toast.error(error)
        setLoading(false)
      }
    }
  }

  const mappedUsers = projectData.map(user => {
    const mappedProjects = user.projects.map(project => {
      const mappedTaskCategories = project.taskCategory.map(category => {
        const mappedTasks = category.tasks.map(task => {
          return {
            taskId: task.uniqueId,
            description: task.description
          }
        })

        return {
          categoryId: category.uniqueId,
          categoryName: category.name,
          tasks: mappedTasks
        }
      })

      return {
        projectId: project.uniqueId,
        projectName: project.name,
        taskCategories: mappedTaskCategories
      }
    })

    return {
      projects: mappedProjects
    }
  })

  return (
    <div>
      {isLoading ? (
        <FallbackSpinner />
      ) : (
        <Card>
          <CardContent>
            <Grid container spacing={2} alignItems='center'>
              {/* Button */}
              <Grid item md={2}>
                <FormControl style={{ width: '140px' }} size='small'>
                  <InputLabel id='demo-simple-select-helper-label'>Projects</InputLabel>
                  <Select
                    label='Projects'
                    defaultValue=''
                    value={selectedValue}
                    onChange={event =>
                      handleMenuItemClick(event.target.value, event.target.innerText)
                    }
                  >
                    {projectData?.map(project =>
                      project?.projects?.map(nestedProject => (
                        <MenuItem
                          key={nestedProject?.uniqueId}
                          value={nestedProject?.uniqueId}
                          onClick={() => handleMenuItemClick(nestedProject?.uniqueId)}
                        >
                          {nestedProject.name ? nestedProject.name : 'NO Data'}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
                {selectedValueError && selectedValue === '' && (
                  <FormHelperText sx={{ color: 'error.main', position: 'absolute' }}>
                    Please select a value
                  </FormHelperText>
                )}{' '}
              </Grid>

              {/* Autocomplete */}
              <Grid item md={5}>
                <Autocomplete
                  sx={{ width: '100%' }}
                  size='small'
                  options={selectedProjectTasks}
                  getOptionLabel={option => option?.description || ''}
                  value={
                    selectedProjectTasks?.find(option => option?.description === description) ||
                    null
                  }
                  onChange={handleAutocompleteChange}
                  renderInput={params => <TextField {...params} label='Description' />}
                />
                {descriptionError && description === '' && (
                  <FormHelperText sx={{ color: 'error.main', position: 'absolute' }}>
                    Please fill Description
                  </FormHelperText>
                )}{' '}
              </Grid>
              {/* DatePicker */}
              <Grid item md={2}>
                <DatePicker
                  selected={date}
                  id='basic-input'
                  popperPlacement={popperPlacement}
                  onChange={date => setDate(date)}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput label='Date' size='small' />}
                />
              </Grid>
              <Grid item md={2}>
                <TimeSheetTextField
                  size='small'
                  style={{ width: 100 }}
                  onClick={() => {}}
                  value={timeInput}
                  time={'0:00'}
                  handlechange={(event, value) => setTimeInput(value)}
                />{' '}
                {timeError && timeInput === '' && (
                  <FormHelperText sx={{ color: 'error.main', position: 'absolute' }}>
                    Please fill Time
                  </FormHelperText>
                )}{' '}
              </Grid>
              <Grid item md={1}>
                <IconButton color='primary' title='send' onClick={handleSubmit}>
                  <Icon icon='mdi:send' fontSize={30} />
                </IconButton>
              </Grid>
            </Grid>
            <Box marginTop={10}>
              <Grid item xs={12}>
                <TimeSheetTable loading={isLoading} />
              </Grid>
            </Box>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default TimesheetsDay
