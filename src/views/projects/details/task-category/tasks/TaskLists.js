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
import {
  deleteTask,
  fetchTasks,
  setEditTask,
  setSelectedCategory,
  setTaskLists
} from 'src/store/apps/projects'
import toast from 'react-hot-toast'
import { unwrapResult } from '@reduxjs/toolkit'
import FallbackSpinner from 'src/layouts/components/LogoSpinner'
import dynamic from 'next/dynamic'
import SimpleBackdrop from 'src/@core/components/spinner'

const DynamicDeleteAlert = dynamic(() => import('src/views/components/alerts/DeleteAlert'), {
  ssr: false,
  loading: () => {
    return <FallbackSpinner />
  }
})

const TaskLists = () => {
  const [isOpen, setOpen] = useState(false)
  const [openAlert, setAlert] = useState(false)
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)
  const [categories, setCategories] = useState([])
  const [expanded, setExpanded] = useState(store.taskLists[0])
  const [row, setRow] = useState({})

  useEffect(() => {
    setCategories(store.taskLists)
  }, [dispatch, store.taskLists])

  const columns = [
    {
      flex: 0.3,
      minWidth: 230,
      field: 'description',
      headerName: 'Task',
      sortable: false
    },
    {
      minWidth: 130,
      field: 'taskAssignedUserName',
      headerName: 'owner',
      sortable: false,
      renderCell: (params, i) => {
        return (
          <Tooltip key={i} title={params?.value}>
            <Avatar sizes='' src={`/images/avatars/${params.row.id}.png`} alt={''} />
          </Tooltip>
        )
      }
    },
    {
      flex: 0.13,
      field: 'taskStatus',
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
                : params.value?.toLowerCase() === 'due' || params.value?.toLowerCase() === 'pending'
                ? 'error'
                : params.value?.toLowerCase() === 'not started'
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
      field: 'taskEstimatedHours',
      sortable: false
    },

    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Due Date',
      field: 'dueDate',
      sortable: false,
      renderCell: params => {
        return formatLocalDate(new Date(params.value))
      }
    },
    {
      flex: 0.13,
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
          <IconButton
            color='info'
            size='small'
            onClick={e => {
              console.log(params)
              setOpen(true),
                dispatch(setEditTask(params.row)),
                localStorage.setItem('category', JSON.stringify(params.row))
            }}
          >
            <Icon icon='mdi:edit-outline' fontSize={20} />
          </IconButton>
          <IconButton
            color='error'
            size='small'
            onClick={() => {
              setRow(params.row), setAlert(true)
            }}
          >
            <Icon icon='mdi:trash-outline' fontSize={20} />
          </IconButton>
        </Box>
      )
    }
  ]

  const handleAccordionExpand = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handleDeleteTask = () => {
    console.log(row)
    try {
      const tasks = [...store.taskLists]
      dispatch(deleteTask(row?.id))
        .then(unwrapResult)
        .then(res => {
          if (res.status === 200) {
            dispatch(fetchTasks(Number(localStorage.getItem('projectId')))).then(() => {
              toast.success(res.data)
              setAlert(false)
            })
          } else {
            toast.error(res.data)
          }
        })
    } catch (error) {
      toast.error(error, { duration: 3000, position: 'top-right' })
    }
  }

  return (
    <Fragment>
      {categories.length == 0 ? (
        <SimpleBackdrop />
      ) : (
        categories.map((category, key) => (
          <Fragment key={key}>
            <Accordion
              expanded={expanded === category.taskCategoryId}
              onChange={handleAccordionExpand(category.taskCategoryId)}
            >
              <AccordionSummary
                id='customized-panel-header-1'
                aria-controls='customized-panel-content-1'

                // expandIcon={expanded === category ? <Icon icon="mdi:chevron-up" /> : <Icon icon="mdi:chevron-down" />}
              >
                <Box className='gap-1' display='flex' justifyContent='space-between' width={'100%'}>
                  <Typography variant='body1' color='secondary'>
                    {category.taskCategory}
                  </Typography>
                  <Button
                    className='rounded-btn'
                    variant='text'
                    size='small'
                    sx={{ background: '#f1e9fb' }}
                    onClick={() => {
                      setOpen(true),
                        dispatch(setSelectedCategory(category?.taskCategory)),
                        localStorage.setItem('category', JSON.stringify(category))
                    }}
                  >
                    Add Task
                  </Button>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <DataGrid
                  autoHeight
                  rows={category.tasks || []}
                  columns={columns}
                  disableRowSelectionOnClick
                  hideFooter
                  sx={{ '&, [class^=MuiDataGrid]': { border: 'none' } }}
                />
              </AccordionDetails>
            </Accordion>
          </Fragment>
        ))
      )}
      <NewTask isOpen={isOpen} setOpen={setOpen} />

      <DynamicDeleteAlert
        open={openAlert}
        setOpen={setAlert}
        title='Delete Task'
        action='Delete'
        handleAction={handleDeleteTask}
      />
    </Fragment>
  )
}

export default TaskLists
