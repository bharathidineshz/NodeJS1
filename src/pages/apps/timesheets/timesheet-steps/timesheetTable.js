import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import TextField from '@mui/material/TextField'
import {
  fetchData,
  fetchTaskData,
  fetchProjectData,
  UpdateData,
  DeleteData,
  fetchAssignedProject,
  fetchAssignedTask
} from 'src/store/apps/timesheets/index'
import Autocomplete from '@mui/material/Autocomplete'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePicker from 'react-datepicker'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import { Button } from '@mui/material'
import { Icon } from '@iconify/react'
import toast from 'react-hot-toast'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { IconButton, Tooltip } from '@mui/material'
import TimeSheetTextField from 'src/pages/apps/timesheets/timesheet-steps/TimeSheetTextField'
import dayjs from 'dayjs'
import { unwrapResult } from '@reduxjs/toolkit'

const TimeSheetTable = ({ popperPlacement, loading }) => {
  const dispatch = useDispatch()
  const { data, taskData, projectData } = useSelector(state => state.timesheets)
  const [flattenedTimesheets, setFlattenedTimesheets] = useState([])

  const [timeInput, setTimeInput] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    dispatch(fetchData())
    dispatch(fetchAssignedTask())
    dispatch(fetchAssignedProject())
  }, [dispatch, loading])

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

  const handleTimeInputChange = (value, params) => {
    handleUpdate({ ...params, row: { ...params.row, burnedHours: value } })
  }

  const handleDateChange = (date, params) => {
    setDate(date)
    if (date instanceof Date && !isNaN(date)) {
      handleUpdate({ ...params, row: { ...params.row, timeSheetDate: date } })
    }
  }

  const handleAutocompleteChange = (e, params) => {
    setDescription(e.target.value)
    handleUpdate({ ...params, row: { ...params?.row, taskId: e.target.value || '' } })
  }

  const handleUpdate = params => {
    const data = {
      id: params?.row?.id,
      burnedHours: params?.row?.burnedHours,
      timeSheetDate: formatDateString(params?.row?.timeSheetDate),
      isBillable: true,
      taskId: params?.row?.taskId,
      projectId: params?.row?.projectId,
      taskCategoryId: params?.row?.taskCategoryId
    }
    dispatch(UpdateData(data))
      .then(unwrapResult)
      .then(() => {
        setDate('')
        setDescription('')
        setTimeInput('')
      })
  }

  const mappedUsers = projectData?.map(user => {
    const mappedProjects = user?.projects?.map(project => {
      const mappedTaskCategories = project?.taskCategory?.map(category => {
        const mappedTasks = category?.tasks?.map(task => {
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

  const columns = [
    {
      flex: 0.25,
      minWidth: 200,
      field: 'projectName',
      headerName: 'Project',
      editable: false
    },
    {
      flex: 0.15,
      minWidth: 300,
      editable: true,
      field: 'taskId',
      headerName: 'Description',
      renderCell: params => params.row.taskDescription,
      renderEditCell: params => {
        return (
          <Select
            sx={{ minWidth: 310, marginLeft: '-15px', outline: 'none' }}
            value={description || params.value}
            onChange={e => handleAutocompleteChange(e, params)}
            label='Projects'
          >
            {taskData
              .filter(x => x.projectId === params?.row?.projectId)
              .map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.taskDescription}
                </MenuItem>
              ))}
          </Select>
        )
      }
    },

    {
      flex: 0.25,
      minWidth: 150,
      editable: true,
      field: 'timeSheetDate',
      headerName: 'Date',
      renderCell: params => dayjs(params.value).format('DD-MM-YYYY'), // Render date as a string
      editField: 'timeSheetDate',
      renderEditCell: params => (
        <DatePicker
          selected={date || new Date()}
          id='basic-input'
          popperPlacement={popperPlacement}
          onChange={date => handleDateChange(date, params)}
          customInput={<CustomInput sx={{ width: 145, marginLeft: '-13px' }} />}
        />
      )
    },
    {
      flex: 0.15,
      type: 'time',
      minWidth: 130,
      editable: true,
      headerName: 'Hours',
      field: 'burnedHours',
      renderEditCell: params => (
        <TimeSheetTextField
          style={{ width: 100 }}
          handlechange={(e, value) => {
            handleTimeInputChange(value.concat(':00') || params.value, params)
          }}
          value={params.value}
        />
      )
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Delete Project'>
            <IconButton
              size='small'
              onClick={() => dispatch(DeleteData(params?.row?.id))}
              color='error'
            >
              <Icon icon='mdi:delete-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <Box sx={{ height: 500 }}>
      <DataGrid rows={data} loading={loading} columns={columns} pageSize={10} />
    </Box>
  )
}

export default TimeSheetTable
