// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { IconButton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from '@iconify/react'
import FallbackSpinner from 'src/@core/components/spinner'
import { unwrapResult } from '@reduxjs/toolkit'
import Toolbar from 'src/views/absence-management/toolBar'
import { deletePolicy, fetchPolicies } from 'src/store/absence-management'
import instance, { base, identifyURL } from 'src/store/endpoints/interceptor'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'
import { endpoints } from 'src/store/endpoints/endpoints'
import axios from 'axios'

const DynamicEditLeavePolicy = dynamic(
  () => import('src/views/absence-management/leave-policy/EditLeavePolicy'),
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

const DepartmentConfig = ({ data }) => {
  // ** States
  const [isLoading, setLoading] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [rowData, setRowData] = useState({})
  const [alert, setOpenAlert] = useState(false)
  const [filteredRows, setFilteredRows] = useState([])
  const dispatch = useDispatch()
  const store = useSelector(state => state.leaveManagement)

  useEffect(() => {
    dispatch(fetchPolicies())
  }, [])
  useEffect(() => {
    setOpen(false)
  }, [alert])

  const columns = [
    {
      flex: 0.35,
      field: 'typeOfLeave',
      headerName: 'Policy',
      renderCell: params => <div style={{ fontWeight: 'bold' }}>{params.value}</div>
    },
    {
      flex: 0.2,
      minWidth: 120,
      headerName: 'Count',
      field: 'allowanceCount'
    },
    {
      flex: 0.2,
      minWidth: 120,
      headerName: 'Alowance Time',
      field: 'allowanceTime'
    },
    {
      flex: 0.2,
      headerName: 'Period',
      field: 'period',
      renderCell: params => {
        return (
          <>
            {params.value?.toLowerCase() === 'month' ? (
              <Typography variant='body2' color='secondary'>
                Month
              </Typography>
            ) : (
              <Typography variant='body2' color='primary'>
                Year
              </Typography>
            )}
          </>
        )
      }
    },

    {
      flex: 0.2,
      headerName: 'Carry Forward Count',
      field: 'carryForwardCount'
    },
    {
      flex: 0.08,
      headerName: 'Action',
      field: 'action',
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={() => {
              setOpen(false), setRowData(row), setOpenAlert(!alert)
            }}
            color='error'
          >
            <Icon icon='mdi:delete-outline' fontSize={20} />
          </IconButton>
        </Box>
      )
    }
  ]

  //delete

  const handleDelete = () => {
    try {
      dispatch(deletePolicy(rowData?.id))
        .then(unwrapResult)
        .then(res => {
          if (res.status === 200) {
            setOpenAlert(!alert)
            dispatch(fetchPolicies())
            toast.success(res.data)
          } else {
            toast.error(res.data)
          }
        })
    } catch (error) {
      toast.error(res.data)
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
            {/* <DataGrid
              autoHeight
              pagination
              rows={searchValue ? filteredRows : store.policies}
              columns={columns}
              rowSelection={false}
              disableColumnMenu={true}
              onCellClick={data => data.field != 'action' && handleRowSelection(data)}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              className='no-border'
              slots={{
                toolbar: () => {
                  return (
                    <Toolbar
                      searchValue={searchValue}
                      handleFilter={handleSearch}
                      label='Department'
                    />
                  )
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
            /> */}
          </Card>

          {/* <DynamicEditLeavePolicy isOpen={isOpen} row={rowData} setOpen={setOpen} />
          <DynamicDeleteAlert
            open={alert}
            setOpen={setOpenAlert}
            title='Delete Policy'
            content='Are you absolutely certain you want to proceed with the deletion?'
            action='Delete'
            handleAction={handleDelete}
          /> */}
        </>
      )}
    </>
  )
}

export async function getStaticProps() {
  // Use Axios to fetch data from an API with headers
  const response = await axios.get(base.dev + endpoints.getLeavePolicy, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`
    }
  })
  const { data } = response

  return {
    props: {
      data
    }
  }
}

export default DepartmentConfig
