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
import { AvatarGroup, Button, Grid, IconButton, Popover, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { getProjectDetails, setSelectedProject } from 'src/store/apps/projects'
import FallbackSpinner from 'src/@core/components/spinner'
import { unwrapResult } from '@reduxjs/toolkit'
import ReportsHeader from './ReportsHeader'
import { fetchPolicies, fetchStatus, resetReport } from 'src/store/leave-management'
import { formatLocalDate } from 'src/helpers/dateFormats'

const LeaveReports = () => {
  // ** States
  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState('asc')
  const [isLoading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const dispatch = useDispatch()
  const store = useSelector(state => state.leaveManagement)

  useEffect(() => {
    dispatch(fetchPolicies())
    dispatch(fetchStatus())

    return () => {
      dispatch(resetReport([]))
    }
  }, [])

  const columns = [
    {
      flex: 0.2,
      minWidth: 230,
      field: 'request',
      headerName: 'Request Type',
      renderCell: params => <div style={{ fontWeight: 'bold' }}>{params.value}</div>
    },
    {
      flex: 0.2,
      minWidth: 230,
      field: 'requestReason',
      headerName: 'Reason',
      renderCell: params => <div style={{ whiteSpace: 'pre-line' }}>{params.value}</div>
    },
    {
      flex: 0.15,
      minWidth: 250,
      field: 'duration',
      headerName: 'Duration'
    },
    {
      flex: 0.15,
      field: 'fromDate',
      headerName: 'From',
      renderCell: params => <>{formatLocalDate(new Date(params.value))}</>
    },
    {
      flex: 0.15,
      field: 'toDate',
      headerName: 'To',
      renderCell: params => <>{formatLocalDate(new Date(params.value))}</>
    },
    {
      flex: 0.15,
      field: 'createdDate',
      headerName: 'Date',
      renderCell: params => <>{formatLocalDate(new Date(params.value))}</>
    },
    {
      flex: 0.15,
      field: 'statusName',
      headerName: 'Status',
      renderCell: params => {
        return (
          <CustomChip
            size='small'
            skin='light'
            color={
              params.row.requestStatusId === 2
                ? 'success'
                : params.row.requestStatusId === 3
                ? 'error'
                : 'warning'
            }
            label={params.value}
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

  // ** renders client column
  const renderUsers = params => {
    const stateNum = Math.floor(Math.random() * 6)
    const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
    const color = states[stateNum]
    const user = store.users?.find(o => o.id === params.userId)
    const fullName = `${user?.firstName} ${user?.lastName}`

    return (
      <CustomAvatar
        skin='light'
        color={color}
        sx={{ mr: 1, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
      >
        {getInitials(fullName ? fullName : 'Unkown User')}
      </CustomAvatar>
    )
  }

  const handleSearch = value => {
    setSearchValue(value)
  }

  const handleProjectSelection = data => {
    console.log('row', data)
    dispatch(getProjectDetails(data.row.uniqueId))
    dispatch(setSelectedProject(data.row))
  }

  return (
    <>
      {isLoading ? (
        <FallbackSpinner />
      ) : (
        <>
          <Card>
            <DataGrid
              autoHeight
              pagination
              rows={store.reports || []}
              columns={columns}
              sortingMode='client'
              rowSelection={false}
              onRowClick={handleProjectSelection}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              loading={store.reports == null}
              className='no-border'
              localeText={{ noRowsLabel: 'No Reports' }}
              disableColumnMenu
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 25
                  }
                }
              }}
              slots={{
                toolbar: () => {
                  return <ReportsHeader />
                }
              }}
            />
          </Card>
        </>
      )}
    </>
  )
}

export default LeaveReports
