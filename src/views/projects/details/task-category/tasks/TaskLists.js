import { Icon } from '@iconify/react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  AvatarGroup,
  Button,
  Grid,
  IconButton,
  Link,
  Tooltip,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { DataGrid } from '@mui/x-data-grid'
import React, { Fragment, useEffect, useState } from 'react'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import { formatLocalDate } from 'src/helpers/dateFormats'
import NewTask from 'src/views/projects/details/task-category/tasks/NewTask'
import { useDispatch, useSelector } from 'react-redux'
import { setEditTask, setSelectedCategory, setTaskLists } from 'src/store/apps/projects'
import toast from 'react-hot-toast'

const TaskLists = () => {
  const [isOpen, setOpen] = useState(false)
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)
  const [categories, setCategories] = useState(store.categories)
  const [expanded, setExpanded] = useState(store.categories[0])

  useEffect(() => {
    setCategories(store.categories)
  }, [store.categories])

  const columns = [
    {
      flex: 0.3,
      minWidth: 230,
      field: 'task',
      headerName: 'Task',
      sortable: false
    },
    {
      minWidth: 130,
      field: 'owner',
      headerName: 'owner',
      sortable: false,
      renderCell: (params, i) => {
        return (
          <Tooltip key={i} title={params?.row?.owner}>
            <Avatar
              sizes=''
              src={`/images/avatars/${params?.row?.id}.png`}
              alt={params?.row?.owner}
            />
          </Tooltip>
        )
      }
    },
    {
      flex: 0.17,
      field: 'status',
      headerName: 'Status',
      sortable: false,
      renderCell: params => {
        return (
          <CustomChip
            size='small'
            skin='light'
            color={
              params.value?.toLowerCase() === 'completed'
                ? 'success'
                : params.value?.toLowerCase() === 'due'
                ? 'error'
                : params.value?.toLowerCase() === 'working on it'
                ? 'info'
                : 'warning'
            }
            label={params.value}
          />
        )
      }
    },

    {
      flex: 0.12,
      headerName: 'Estimated Hours',
      field: 'estimatedHours',
      sortable: false
    },

    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Due Date',
      field: 'dueDate',
      sortable: false
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Billable',
      field: 'isBillable',
      sortable: false,
      renderCell: params => (
        <Grid>
          {params.value ? (
            <CustomAvatar skin='light' color='success'>
              <Icon icon='mdi:checkbox-marked-circle-outline' />
            </CustomAvatar>
          ) : (
            <CustomAvatar skin='light' color='error'>
              <Icon icon='mdi:close-circle-outline' />
            </CustomAvatar>
          )}
        </Grid>
      )
    },
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Tooltip title='Edit'>
            <IconButton
              color='info'
              size='small'
              onClick={e => {
                console.log(params)
                setOpen(true), dispatch(setEditTask(params.row))
              }}
            >
              <Icon icon='mdi:edit-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton color='error' size='small' onClick={handleDeleteTask(params.row)}>
              <Icon icon='mdi:trash-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  const handleAccordionExpand = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handleDeleteTask = row => e => {
    try {
      const tasks = [...store.taskLists]
      tasks.splice(row.id - 1, 1)
      dispatch(setTaskLists(tasks))
      toast.success('Task Deleted', { duration: 3000, position: 'top-right' })
    } catch (error) {
      toast.error(error, { duration: 3000, position: 'top-right' })
    }
  }

  return (
    <Fragment>
      {categories.map((category, key) => (
        <Fragment key={key}>
          <Accordion expanded={expanded === category} onChange={handleAccordionExpand(category)}>
            <AccordionSummary
              id='customized-panel-header-1'
              aria-controls='customized-panel-content-1'

              // expandIcon={expanded === category ? <Icon icon="mdi:chevron-up" /> : <Icon icon="mdi:chevron-down" />}
            >
              <Box className='gap-1' display='flex' justifyContent='space-between' width={'100%'}>
                <Typography variant='body1' color='secondary'>
                  {category}
                </Typography>
                <Button
                  className='rounded-btn'
                  variant='text'
                  size='small'
                  sx={{ background: '#f1e9fb' }}
                  onClick={() => {
                    setOpen(true), dispatch(setSelectedCategory(category))
                  }}
                >
                  Add Task
                </Button>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <DataGrid
                autoHeight
                rows={store.taskLists}
                columns={columns}
                disableRowSelectionOnClick
                hideFooter
                sx={{ '&, [class^=MuiDataGrid]': { border: 'none' } }}
              />
            </AccordionDetails>
          </Accordion>
        </Fragment>
      ))}
      <NewTask isOpen={isOpen} setOpen={setOpen} />
    </Fragment>
  )
}

export default TaskLists
