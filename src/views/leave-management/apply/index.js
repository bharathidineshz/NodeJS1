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
import {
  fetchProjects,
  fetchUsers,
  fetchClients,
  setProject,
  deleteProject,
  getProjectDetails,
  setSelectedProject
} from 'src/store/apps/projects'
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
  fetchUserReports,
  fetchDashboard
} from 'src/store/leave-management'
import { formatLocalDate } from 'src/helpers/dateFormats'
import dynamic from 'next/dynamic'

const DynamicEditLeaveRequest = dynamic(
  () => import('src/views/leave-management/apply/EditLeaveRequest'),
  {
    ssr: false,
    loading: () => {
      return <FallbackSpinner />
    }
  }
)

const LeaveApply = () => {
  // ** States
  const [row, setRow] = useState({})
  const [sort, setSort] = useState('asc')
  const [isLoading, setLoading] = useState(true)
  const [isOpen, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const [filteredRows, setFilteredRows] = useState([])
  const dispatch = useDispatch()
  const store = useSelector(state => state.leaveManagement)

  useEffect(() => {
    dispatch(fetchPolicies())
    dispatch(fetchUsers())
      .then(unwrapResult)
      .then(res => {
        const currentUser = JSON.parse(localStorage.getItem('userData'))
        const user = res.find(o => currentUser.user === o.email)
        dispatch(fetchDashboard(user.id))
      })
    dispatch(fetchStatus())
    dispatch(fetchMyLeaves())
    setLoading(false)
  }, [dispatch])

  const columns = [
    {
      flex: 0.1,
      field: 'id',
      minWidth: 80,
      headerName: 'S.NO'
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'requestType',
      headerName: 'Request'
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'requestReason',
      headerName: 'Reason'
    },
    {
      flex: 0.17,
      minWidth: 100,
      headerName: 'From Date',
      field: 'fromDate',
      renderCell: params => {
        return formatLocalDate(new Date(params.value))
      }
    },
    {
      flex: 0.17,
      minWidth: 100,
      headerName: 'To Date',
      field: 'toDate',
      renderCell: params => {
        return formatLocalDate(new Date(params.value))
      }
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
    }
  ]

  const handleSortModel = newModel => {
    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)
      fetchTableData(newModel[0].sort, searchValue, newModel[0].field)
    } else {
      setSort('asc')
      setSortColumn('full_name')
    }
  }

  const handleSearch = value => {
    setSearchValue(value)
    const filterdRows = store.myLeaves.filter(
      l =>
        l.requestReason.toLowerCase().trim().includes(value) ||
        l.requestType.toLowerCase().trim().includes(value)
    )
    setFilteredRows(filterdRows)
  }

  const handleRowSelection = data => {
    console.log('row', data)
    setOpen(true)
    setRow(data.row)
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} lg={6}>
          <LeaveDashboard />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <LeaveDetails />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <Toolbar searchValue={searchValue} handleFilter={handleSearch} />
            <DataGrid
              autoHeight
              pagination
              rows={searchValue ? filteredRows : store.myLeaves}
              columns={columns}
              rowSelection={false}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              paginationModel={paginationModel}
              onSortModelChange={() => {}}
              loading={store.myLeaves ? false : true}
              onPaginationModelChange={setPaginationModel}
              onRowClick={data => data.row.requestStatusId == 1 && handleRowSelection(data)}
              slotProps={{
                baseButton: {
                  variant: 'outlined'
                },
                toolbar: {
                  value: searchValue,
                  clearSearch: () => handleSearch(''),
                  onChange: event => handleSearch(event.target.value)
                }
              }}
            />
          </Card>
        </Grid>
      </Grid>
      <DynamicEditLeaveRequest isOpen={isOpen} row={row} setOpen={setOpen} />
    </>
  )
}

export default LeaveApply
