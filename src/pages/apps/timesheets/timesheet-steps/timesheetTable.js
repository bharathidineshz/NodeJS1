import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import TextField from '@mui/material/TextField'
import { fetchData, fetchTaskData, fetchProjectData, UpdateData, DeleteData } from 'src/store/apps/timesheets/index'
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
import TimeSheetTextField from 'src/pages/apps/timesheets/timesheet-steps/TimeSheetTextField';

const TimeSheetTable = ({ popperPlacement, loading }) => {
  const dispatch = useDispatch()
  const { data, taskData, projectData } = useSelector(state => state.timesheets)
  const [flattenedTimesheets, setFlattenedTimesheets] = useState([])

  const [timeInput, setTimeInput] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    dispatch(fetchData())
    dispatch(fetchTaskData())
    dispatch(fetchProjectData())
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
    handleUpdate({ ...params, row: { ...params.row, time: value } })
  }

  const handleDateChange = (date, params) => {
    setDate(date)
    if (date instanceof Date && !isNaN(date)) {
      handleUpdate({ ...params, row: { ...params.row, date } })
    }
  }

  const handleAutocompleteChange = (e, params) => {
    setDescription(e.target.value);
    handleUpdate({ ...params, row: { ...params?.row, description: e.target.value || '' } });

  };

  useEffect(() => {
    if (data) {
      const flattenedData = []
      data.forEach(project => {
        const projectName = project.project_name
        const projectId = project.projectId

        project.timesheet.forEach(entry => {
          const flattenedEntry = {
            projectId: projectId,
            project_name: projectName,
            id: entry.tsMappingUid,
            date: new Date(entry.date),
            time: entry.time,
            description: entry.description,
            category: entry.category,
            categoryName: entry.categoryName,
            tsMappingUid: entry.tsMappingUid
          }

          flattenedData.push(flattenedEntry)
        })
      })


      // Sort the flattened data based on the 'date' field in descending order
      flattenedData.sort((a, b) => {
        return b.date - a.date
      })

      setFlattenedTimesheets(flattenedData)

    }
  }, [data])

  const handleUpdate = params => {
    const descriptionToCheck = params?.row?.description
    const selectedTask = taskData.find(task => task.description === descriptionToCheck)

    // Creating a timesheet entry object
    const timesheetEntry = {
      tsMappingUid: params?.row?.id,
      predefinedTaskId: '',
      date: formatDateString(params?.row?.date),
      time: params?.row?.time,
      category: selectedTask?.taskUniqueId ? selectedTask?.taskUniqueId : params?.row?.category,
      categoryName: selectedTask?.name ? selectedTask.name : params?.row?.categoryName,
      description: params?.row?.description
    }

    const payload = [
      {
        projectId: params?.row?.projectId,
        timesheet: [timesheetEntry]
      }
    ]
    dispatch(UpdateData(payload))
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

  const columns = [
    {
      flex: 0.25,
      minWidth: 200,
      field: 'project_name',
      headerName: 'Project',
      editable: false,
    },
    {
      flex: 0.15,
      minWidth: 300,
      editable: true,
      field: 'description',
      headerName: 'Description',
      renderEditCell: params => {
        const project = mappedUsers.find(proj => proj.projects.some(p => p.projectId === params?.row?.projectId));
        let selectedProjectTasks = [];

        if (project) {
          const selectedProject = project.projects.find(p => p.projectId === params?.row?.projectId);
          if (selectedProject) {
            const tasks = selectedProject.taskCategories.flatMap(category => category.tasks);
            selectedProjectTasks = tasks;
          }
        }

        return (
          <Select
            sx={{ minWidth: 310, marginLeft: '-15px', outline: 'none' }}
            value={description || params.value}
            onChange={(e) => handleAutocompleteChange(e, params)}
            label='Projects'

          >
            {selectedProjectTasks.map(option => (
              <MenuItem key={option.description} value={option.description}>
                {option.description}
              </MenuItem>
            ))}
          </Select>
        );
      }
    },

    {
      flex: 0.25,
      minWidth: 150,
      editable: true,
      field: 'date',
      headerName: 'Date',
      renderCell: params => params.value.toLocaleDateString(), // Render date as a string
      editField: 'date',
      renderEditCell: params => (
        <DatePicker
          selected={date || params.value}
          id='basic-input'
          popperPlacement={popperPlacement}
          onChange={date => handleDateChange(date, params)}
          customInput={< CustomInput sx={{ width: 145, marginLeft: '-13px' }} />}
        />
      )
    },
    {
      flex: 0.15,
      type: 'time',
      minWidth: 130,
      editable: true,
      headerName: 'Time',
      field: 'time',
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
            <IconButton size='small' onClick={() => dispatch(DeleteData(params?.row?.tsMappingUid))} color='error'>
              <Icon icon='mdi:delete-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]


  return (
    <Box sx={{ height: 500 }}>
      <DataGrid rows={flattenedTimesheets} loading={loading} columns={columns} pageSize={10} />
    </Box>
  )
}

export default TimeSheetTable
