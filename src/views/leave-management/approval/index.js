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
import {
  AvatarGroup,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Popover,
  TextField,
  Tooltip
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from '@iconify/react'
import OptionsMenu from 'src/@core/components/option-menu'
import FallbackSpinner from 'src/@core/components/spinner'
import { unwrapResult } from '@reduxjs/toolkit'
import LeaveHeader from 'src/views/leave-management/LeaveHeader'
import Toolbar from 'src/views/leave-management/toolBar'
import { useTheme } from '@emotion/react'
import toast from 'react-hot-toast'
import {
  fetchApprovals,
  fetchPolicies,
  fetchRequests,
  fetchStatus,
  fetchUsers,
  postLeaveApproval,
  setLeaveApproval
} from 'src/store/leave-management'
import { formatLocalDate } from 'src/helpers/dateFormats'
import { approvalRequest } from 'src/helpers/requests'

const Approval = () => {
  // ** States
  const [total, setTotal] = useState(0)
  const [comment, setComment] = useState('')

  const [rows, setRows] = useState([
    {
      id: 1,
      date: new Date().toDateString(),
      userName: 'Chanakya Jayabalan',
      email: 'chanakya.jayabalan@athen.tech',
      status: 'Pending',
      request: 'Permission',
      reason: 'Going Hospital',
      image: '/images/avatars/1.png',
      fromDate: new Date().toDateString(),
      toDate: new Date().toDateString()
    },
    {
      id: 2,
      request: 'Sick Leave',
      date: new Date().toDateString(),
      status: 'Pending',
      userName: 'Dhineshkumar Selvam',
      email: 'dhinesh.selvam@athen.tech',
      image: '/images/avatars/2.png',
      reason: 'Fever',
      fromDate: new Date().toDateString(),
      toDate: new Date().toDateString()
    },
    {
      id: 3,
      request: 'Casual Leave',
      date: new Date().toDateString(),
      status: 'Approved',
      userName: 'Naveenkumar Mounasamy',
      email: 'naveen.mounasamy@athen.tech',
      image: '/images/avatars/3.png',
      reason: 'Festival celeberation in hometown',
      fromDate: new Date().toDateString(),
      toDate: new Date().toDateString()
    },
    {
      id: 4,
      request: 'Work From Home',
      date: new Date().toDateString(),
      status: 'Rejected',
      userName: 'Dhivya Kumarasamy',
      email: 'dhivya.kumarasamy@athen.tech',
      image: '/images/avatars/4.png',
      reason: 'Powercut in Office',
      fromDate: new Date().toDateString(),
      toDate: new Date().toDateString()
    }
  ])
  const [isLoading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [filteredRows, setFilteredRows] = useState([])

  const [respond, setRespond] = useState({
    isRejected: false,
    isOpenDialog: false,
    isApproved: false.valueOf,
    rejectData: {}
  })
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const dispatch = useDispatch()
  const store = useSelector(state => state.leaveManagement)
  const theme = useTheme()

  useEffect(() => {
    dispatch(fetchPolicies())
    dispatch(fetchUsers())
      .then(unwrapResult)
      .then(res => {
        dispatch(fetchStatus())
        dispatch(fetchApprovals())
      })
  }, [dispatch])

  const columns = [
    {
      flex: 0.05,
      field: 'id',
      minWidth: 80,
      headerName: 'Id'
    },
    {
      flex: 0.35,
      field: 'user',
      headerName: 'User',
      renderCell: ({ row, value }) => {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <CustomAvatar
              src={row.image}
              skin='light'
              color='primary'
              sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
            >
              {getInitials(value ? value.fullName : 'Unknown User')}
            </CustomAvatar>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant=''>{value?.fullName}</Typography>
              <Typography variant='caption'>{value?.email}</Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 120,
      headerName: 'Request',
      field: 'request'
    },
    {
      flex: 0.3,
      headerName: 'Reason',
      field: 'requestReason'
    },
    {
      flex: 0.175,
      minWidth: 110,
      field: 'fromDate',
      headerName: 'From Date',
      renderCell: params => {
        return <>{formatLocalDate(new Date(params.value))}</>
      }
    },
    {
      flex: 0.175,
      minWidth: 110,
      field: 'toDate',
      headerName: 'To Date',
      renderCell: params => {
        return <>{formatLocalDate(new Date(params.value))}</>
      }
    },
    {
      flex: 0.175,
      minWidth: 110,
      field: 'comment',
      headerName: 'Comment'
    },
    {
      flex: 0.3,
      sortable: false,
      field: 'requestStatusId',
      headerName: 'Status',
      align: 'center',
      renderCell: params => (
        <Box columnGap={2} sx={{ display: 'flex', alignItems: 'center' }}>
          {params.value === 1 ? (
            <>
              <Button
                size='small'
                variant='contained'
                onClick={handleApproval(params.row, '')}
                color='error'
              >
                Reject
              </Button>
              <Button
                size='small'
                variant='contained'
                onClick={handleApproval(params.row, 'Approved')}
                color='success'
              >
                Approve
              </Button>
            </>
          ) : params.value === 2 ? (
            <CustomChip size='small' label='Approved' skin='light' color='success' />
          ) : (
            <CustomChip size='small' label='Rejected' skin='light' color='error' />
          )}
        </Box>
      )
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

  //handle approval
  const handleApproval = (row, name) => e => {
    if (name === 'Approved' || name === 'Rejected') {
      const _row = name == 'Approved' ? row : respond.rejectData
      const _comment = document.getElementById("Comment").value;
      const req = {
        comment: name === 'Rejected' ?  _comment: '',
        statusId: name == 'Approved' ? 2 : name == 'Rejected' ? 3 : 1,
        ..._row
      }
      const request = approvalRequest(req)
      dispatch(postLeaveApproval(request))
        .then(unwrapResult)
        .then(res => {
          if (res.status === 200 || res.status === 201) {
            const rows = [...store.approvals]
            const index = rows.findIndex(o => o.id == _row.id)
            rows[index] = {
              ...rows[index],
              requestStatusId: name === 'Approved' ? 2 : name === 'Rejected' ? 3 : 1,
              status: name
            }
            dispatch(setLeaveApproval(rows))
            setRespond(state => ({ ...state, isOpenDialog: false }))
            name == 'Approved' ? toast.success('Request Approved') : toast.error('Request Rejected')
          } else {
            toast.error(`Error Occurred`)
          }
        })
    } else {
      setRespond(state => ({ ...state, rejectData: row, isOpenDialog: true }))
    }
  }

  const handleSearch = value => {
    setSearchValue(value)
    const filteredRows = store.approvals.filter(
      o =>
        o.requestReason.toLowerCase().trim().includes(value) ||
        o.user.fullName.toLowerCase().trim().includes(value) ||
        o.user.email.toLowerCase().trim().includes(value)
    )
    setFilteredRows(filteredRows)
  }

  const handleComment = e => {
    
  }

  const handleClose = () => {
    setRespond(state => ({ ...state, isOpenDialog: false }))
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
              rows={searchValue ? filteredRows : store.approvals}
              rowCount={store.approvals ? store.approvals.length : 0}
              columns={columns}
              sortingMode='server'
              rowSelection={false}
              onRowClick={() => {}}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              paginationModel={paginationModel}
              onSortModelChange={handleSortModel}
              slots={{
                toolbar: () => {
                  return <Toolbar isExport searchValue={searchValue} handleFilter={handleSearch} />
                }
              }}
              onPaginationModelChange={setPaginationModel}
              loading={store.approvals ? false : true}
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
              className='no-border'
            />
          </Card>

          <Dialog
            open={respond.isOpenDialog}
            onClose={handleClose}
            aria-labelledby='form-dialog-title'
            maxWidth='sm'
            fullWidth
          >
            <DialogTitle id='form-dialog-title'>Comment</DialogTitle>
            <DialogContent>
              <TextField
                key='comment'
                id='Comment'
                fullWidth
                minRows={2}
                multiline
                autoFocus
                sx={{ mt: 4 }}
              />
            </DialogContent>
            <DialogActions className='dialog-actions-dense'>
              <Button variant='outlined' onClick={handleClose}>
                Discard
              </Button>
              <Button variant='contained' color='error' onClick={handleApproval({}, 'Rejected')}>
                Reject
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  )
}

export default Approval
