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
import LeaveHeader from 'src/views/leave-management/LeaveHeader'
import Toolbar from 'src/views/leave-management/toolBar'
import Dashboard from '../dashboard/Dashboard'
import { deletePolicy, fetchPolicies } from 'src/store/leave-management'
import { base } from 'src/store/endpoints/interceptor'
import EditLeavePolicy from './EditLeavePolicy'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'
import { errorToast, successToast } from 'src/helpers/helpers'

const DynamicEditLeavePolicy = dynamic(
  () => import('src/views/leave-management/leave-policy/EditLeavePolicy'),
  {
    ssr: false,
    loading: () => {
      return <FallbackSpinner />
    }
  }
)

const LeavePolicy = ({ data }) => {
  // ** States
  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState('asc')
  const [isLoading, setLoading] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [rowData, setRowData] = useState({})
  const [filteredRows, setFilteredRows] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const dispatch = useDispatch()
  const store = useSelector(state => state.leaveManagement)

  useEffect(() => {
    dispatch(fetchPolicies())
  }, [])

  const columns = [
    {
      flex: 0.05,
      field: 'id',
      minWidth: 80,
      headerName: 'Id'
    },
    {
      flex: 0.35,
      field: 'typeOfLeave',
      headerName: 'Policy'
    },
    {
      flex: 0.2,
      minWidth: 120,
      headerName: 'Count',
      field: 'leaveCount'
    },
    {
      flex: 0.2,
      minWidth: 120,
      headerName: 'Period',
      field: 'period'
    },
    {
      flex: 0.2,
      minWidth: 120,
      headerName: 'Carry Forward',
      field: 'carryForward',

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
      flex: 0.2,
      minWidth: 120,
      headerName: 'Carry Forward Count',
      field: 'carryForwardCount'
    }
    // {
    //   flex: 0.08,
    //   headerName: 'Actions',
    //   sortable: false,
    //   renderCell: ({ row }) => (
    //     <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //       <IconButton onClick={handleDelete(row)} color='error'>
    //         <Icon icon='mdi:delete-outline' fontSize={20} />
    //       </IconButton>
    //     </Box>
    //   )
    // }
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

  //delete

  const handleDelete = row => e => {
    try {
      setOpen(false)
      dispatch(deletePolicy(row.id))
      dispatch(fetchPolicies())
      successToast('Policy Deleted')
    } catch (error) {
      errorToast(error)
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

    const rows = store.policies.filter(
      l =>
        l.typeOfLeave.toLowerCase().trim().includes(value) ||
        l.period.toLowerCase().trim().includes(value)
    )
    setFilteredRows(rows)
  }

  const handleRowSelection = data => {
    console.log('row', data)
    setOpen(true)
    setRowData(data.row)
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
              rows={searchValue ? filteredRows : store.policies}
              rowCount={store.policies.length}
              columns={columns}
              rowSelection={false}
              onRowClick={handleRowSelection}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              className='no-border'
              slots={{
                toolbar: () => {
                  return <Toolbar searchValue={searchValue} handleFilter={handleSearch} isExport />
                }
              }}
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

          <DynamicEditLeavePolicy isOpen={isOpen} row={rowData} setOpen={setOpen} />
        </>
      )}
    </>
  )
}

export const getStaticProps = async () => {
  const response = await fetch(base.local + 'api/leave') // Update with your API route
  const { data } = await response.json()

  return {
    props: {
      data
    }
  }
}

export default LeavePolicy
