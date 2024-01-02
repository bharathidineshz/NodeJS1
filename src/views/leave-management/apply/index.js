// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'

// ** ThirdParty Components
import axios from 'axios'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { AvatarGroup, Button, Grid, IconButton, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from '@iconify/react'
import OptionsMenu from 'src/@core/components/option-menu'
import FallbackSpinner from 'src/@core/components/spinner'
import { unwrapResult } from '@reduxjs/toolkit'
import Toolbar from 'src/views/leave-management/toolBar'
import LeaveDashboard from 'src/views/leave-management/dashboard/Dashboard'
import LeaveDetails from '../dashboard/LeaveDetails'
import LeaveApplyForm from './LeaveApplyForm'
import {
  fetchMyLeaves,
  fetchStatus,
  fetchPolicies,
  fetchUsers,
  fetchUserReports,
  fetchDashboard,
  deleteRequest
} from 'src/store/leave-management'
import { formatLocalDate } from 'src/helpers/dateFormats'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'
import SimpleBackdrop from 'src/@core/components/spinner'
import { customErrorToast, customSuccessToast } from 'src/helpers/custom-components/toasts'

const DynamicEditLeaveRequest = dynamic(
  () => import('src/views/leave-management/apply/EditLeaveRequest'),
  {
    ssr: false,
    loading: () => {
      return <FallbackSpinner />
    }
  }
)

const DynamicDeleteAlert = dynamic(() => import('src/views/components/alerts/DeleteAlert'), {
  ssr: false,
  loading: () => {
    return <FallbackSpinner />
  }
})

const LeaveApply = () => {
  // ** States
  const [row, setRow] = useState({})
  const [sort, setSort] = useState('asc')
  const [isLoading, setLoading] = useState(true)
  const [isOpen, setOpen] = useState(false)
  const [alert, setOpenAlert] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [filteredRows, setFilteredRows] = useState([])
  const dispatch = useDispatch()
  const store = useSelector(state => state.leaveManagement)

  useEffect(() => {
    dispatch(fetchUsers()).then(res => {
      const currentUser = JSON.parse(localStorage.getItem('userData'))
      const user = res.payload.find(o => currentUser.user === o.email)
      dispatch(fetchStatus())
      dispatch(fetchMyLeaves())
      dispatch(fetchDashboard(user?.id))
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [alert])

  const columns = [
    {
      flex: 0.15,
      minWidth: 120,
      field: 'leavePolicyName',
      headerName: 'Request'
    },
    {
      flex: 0.17,
      minWidth: 120,
      field: 'requestReason',
      headerName: 'Reason',
      renderCell: params => <div style={{ whiteSpace: 'pre-line' }}>{params.value}</div>
    },
    {
      flex: 0.14,
      minWidth: 100,
      headerName: 'From Date',
      field: 'fromDate',
      renderCell: params => {
        return formatLocalDate(new Date(params.value))
      }
    },
    {
      flex: 0.14,
      minWidth: 100,
      headerName: 'To Date',
      field: 'toDate',
      renderCell: params => {
        return formatLocalDate(new Date(params.value))
      }
    },
    {
      minWidth: 100,
      field: 'isFromHalfDay',
      headerName: 'From Half day',
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
      minWidth: 100,
      field: 'isToHalfDay',
      headerName: 'To Half Day',
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
      flex: 0.12,
      minWidth: 100,
      headerName: 'Status',
      field: 'requestStatusId',
      renderCell: params => {
        const status = store.statuses.find(s => s.id === params.value)

        return (
          <CustomChip
            size='small'
            skin='light'
            color={params.value === 2 ? 'success' : params.value === 3 ? 'error' : 'warning'}
            label={status?.statusName}
          />
        )
      }
    },
    {
      flex: 0.08,
      headerName: 'Action',
      field: 'action',
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {row.requestStatusId === 2 ? (
            <Button
              variant='text'
              color='secondary'
              size='small'
              onClick={() => {
                setOpen(false), setRow(row), setOpenAlert(!alert)
              }}
            >
              Cancel
            </Button>
          ) : row.requestStatusId === 3 ? null : (
            <IconButton
              onClick={() => {
                setOpen(false), setRow(row), setOpenAlert(!alert)
              }}
              color='error'
            >
              <Icon icon='mdi:delete-outline' fontSize={20} />
            </IconButton>
          )}
        </Box>
      )
    }
  ]

  const handleSearch = value => {
    setSearchValue(value)
    const data = store.myLeaves.map(o => ({
      ...o,
      requestReason: o.requestReason.toLowerCase(),
      leavePolicyName: o.leavePolicyName.toLowerCase()
    }))
    const filteredRows = data.filter(
      o =>
        o.requestReason.trim().includes(value.toLowerCase()) ||
        o.leavePolicyName.trim().includes(value.toLowerCase())
    )
    const _data = store.myLeaves.filter(o => filteredRows.some(f => f.id == o.id))
    setFilteredRows(_data)
  }

  const handleRowSelection = data => {
    console.log('row', data)
    setOpen(true)
    setRow(data.row)
  }

  //delete

  const handleDelete = () => {
    try {
      setOpenAlert(!alert)
      dispatch(deleteRequest(row?.id))
        .then(unwrapResult)
        .then(res => {
          if (res.status === 200) {
            const currentUser = JSON.parse(localStorage.getItem('userData'))
            const user = store.users.find(o => currentUser.user === o.email)
            dispatch(fetchDashboard(user.id))
            dispatch(fetchMyLeaves())
            customSuccessToast(res.data)
          } else {
            customErrorToast(res.data)
          }
        })
    } catch (error) {
      toast.error(res.data)
    }
  }

  return (
    <>
      {store?.dashboards != null && store?.myLeaves != null ? (
        <Grid container spacing={6}>
          <Grid item xs={12} md={6} lg={6}>
            <LeaveDashboard />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <LeaveDetails />
          </Grid>
          <Grid item xs={12}>
            <Card>
              <Toolbar searchValue={searchValue} handleFilter={handleSearch} label='Request' />
              <DataGrid
                autoHeight
                pagination
                rows={searchValue ? filteredRows : store.myLeaves}
                columns={columns}
                rowSelection={false}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                loading={store.myLeaves == null}
                localeText={{ noRowsLabel: 'No Leaves' }}
                onCellClick={data =>
                  data.row.requestStatusId == 1 &&
                  data.field != 'action' &&
                  handleRowSelection(data)
                }
                sx={{
                  '&:hover': {
                    cursor: 'pointer'
                  }
                }}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 25
                    }
                  }
                }}
              />
            </Card>
          </Grid>
        </Grid>
      ) : (
        <SimpleBackdrop />
      )}

      <DynamicEditLeaveRequest isOpen={isOpen} row={row} setOpen={setOpen} />
      <DynamicDeleteAlert
        open={alert}
        setOpen={setOpenAlert}
        title='Delete Request'
        action='Delete'
        handleAction={handleDelete}
      />
    </>
  )
}

export default LeaveApply
