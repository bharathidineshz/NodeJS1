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
  FormHelperText,
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
import LeaveHeader from 'src/views/absence-management/LeaveHeader'
import Toolbar from 'src/views/absence-management/toolBar'
import { useTheme } from '@emotion/react'
import toast from 'react-hot-toast'
import {
  fetchApprovals,
  fetchPolicies,
  fetchRequests,
  fetchStatus,
  fetchUsers,
  postLeaveApproval,
  putRequestApproval,
  setApprovals,
  setLeaveApproval
} from 'src/store/absence-management'
import { formatLocalDate } from 'src/helpers/dateFormats'
import { approvalRequest } from 'src/helpers/requests'
import { customErrorToast, customSuccessToast } from 'src/helpers/custom-components/toasts'
import SimpleBackdrop from 'src/@core/components/spinner'
import { handleResponse } from 'src/helpers/helpers'
import { LEAVE_STATUS } from 'src/helpers/constants'

const Approval = () => {
  // ** States
  const [total, setTotal] = useState(0)
  const [comment, setComment] = useState('')

  const [isLoading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [filteredRows, setFilteredRows] = useState([])
  const [errorComment, setErrorComment] = useState(false)

  const [respond, setRespond] = useState({
    isRejected: false,
    isOpenDialog: false,
    isApproved: false.valueOf,
    rejectData: {},
    isLoading: false
  })
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })
  const dispatch = useDispatch()
  const store = useSelector(state => state.leaveManagement)
  const theme = useTheme()

  useEffect(() => {
    dispatch(fetchUsers())
    // dispatch(fetchStatus())
    dispatch(fetchApprovals()).then(() => setLoading(false))
  }, [dispatch])

  const columns = [
    {
      flex: 0.35,
      field: 'userName',
      headerName: 'User',
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <CustomAvatar
              src={row.image}
              skin='light'
              color='primary'
              sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
            >
              {getInitials(row.userName ? row.userName : 'Unknown User')}
            </CustomAvatar>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant=''>{row?.userName}</Typography>
              <Typography variant='caption'>{row?.email}</Typography>
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
      flex: 0.2,
      headerName: 'Reason',
      field: 'requestReason',
      renderCell: params => <div style={{ whiteSpace: 'pre-line' }}>{params.value}</div>
    },
    {
      flex: 0.16,
      field: 'fromDate',
      headerName: 'From Date',
      renderCell: params => {
        return <>{formatLocalDate(new Date(params.value))}</>
      }
    },
    {
      flex: 0.16,
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
      headerName: 'Comment',
      renderCell: params => <div style={{ whiteSpace: 'pre-line' }}>{params.value}</div>
    },
    {
      flex: 0.26,
      sortable: false,
      field: 'currentStatusId',
      headerName: 'Status',
      align: 'left',
      renderCell: params => {
        const status = LEAVE_STATUS.find(o => o.id == params.value)

        return (
          <Box columnGap={2} sx={{ display: 'flex' }}>
            {status.id === 1 ? (
              <Box className='gap-1' sx={{ display: 'flex', alignItems: 'center' }}>
                <>
                  <Button
                    size='small'
                    variant='contained'
                    onClick={handleApproval(params.row, '')}
                    color='error'
                    sx={{ fontSize: 12 }}
                  >
                    Reject
                  </Button>
                  <Button
                    size='small'
                    variant='contained'
                    onClick={handleApproval(params.row, 'Approved')}
                    color='success'
                    sx={{ fontSize: 12 }}
                  >
                    Approve
                  </Button>
                </>
              </Box>
            ) : (
              <CustomChip size='small' label={status.name} skin='light' color={status.color} />
            )}
          </Box>
        )
      }
    }
  ]

  //UPDATE APPROVAL STATE
  const updateApprovalState = newApproval => {
    let approvals = [...store.approvals]
    const indexToReplace = approvals.findIndex(
      item => item.leaveRequestApprovalId === newApproval.id
    )

    const status = store.statuses?.find(o => o.id == newApproval.statusId)

    if (indexToReplace !== -1) {
      approvals[indexToReplace] = {
        ...approvals[indexToReplace],
        comment: newApproval.comment,
        status: status && status.statusName,
        currentStatusId: newApproval.statusId
      }
    }
    dispatch(setLeaveApproval(approvals))
  }

  //handle approval
  const handleApproval = (row, name) => e => {
    if (name === 'Approved' || name === 'Rejected') {
      setRespond(state => ({ ...state, isOpenDialog: false, isLoading: true }))

      const _row = name == 'Approved' ? row : respond.rejectData
      const _comment = document.getElementById('Comment')?.value
        ? document.getElementById('Comment').value
        : ''

      if ((_comment == null || _comment == '') && name == 'Rejected') {
        setErrorComment(true)

        return
      }
      setErrorComment(false)
      const req = {
        ..._row,
        comment: _comment,
        leaveStatusId: name == 'Approved' ? 2 : name == 'Rejected' ? 3 : 1,
        approvalLevelId: _row.currentLevelId
      }
      const request = approvalRequest(req)
      dispatch(putRequestApproval(request))
        .then(unwrapResult)
        .then(res => {
          // if (res.status === 200 || res.status === 201) {
          //   const rows = [...store.approvals]
          //   const index = rows.findIndex(o => o.id == _row.id)
          //   rows[index] = {
          //     ...rows[index],
          //     requestStatusId: name === 'Approved' ? 2 : name === 'Rejected' ? 3 : 1,
          //     status: name
          //   }
          //   dispatch(setLeaveApproval(rows))

          //   name == 'Approved' ? customSuccessToast(res.data) : customErrorToast(res.data)
          // } else {
          //   customErrorToast(res.data)
          // }
          setRespond(state => ({ ...state, isOpenDialog: false, isLoading: false }))
          handleResponse('update', res, updateApprovalState)
        })
    } else {
      setRespond(state => ({ ...state, rejectData: row, isOpenDialog: true, isLoading: false }))
    }
  }

  const handleSearch = value => {
    setSearchValue(value)
    const data = store.approvals.map(o => ({
      ...o,
      request: o.request.toLowerCase(),
      requestReason: o.requestReason.toLowerCase(),
      userName: o.userName.toLowerCase(),
      email: o.email.toLowerCase(),
      comment: o.comment.toLowerCase()
    }))

    const filteredRows = data.filter(
      o =>
        o.request.trim().includes(value.toLowerCase()) ||
        o.userName.trim().includes(value.toLowerCase()) ||
        o.requestReason.trim().includes(value.toLowerCase()) ||
        o.email.trim().includes(value.toLowerCase()) ||
        o.comment.trim().includes(value.toLowerCase())
    )
    const _data = store.approvals.filter(o => filteredRows.some(f => f.id == o.id))
    setFilteredRows(_data)
  }

  const handleComment = e => {}

  const handleClose = () => {
    setRespond(state => ({ ...state, isOpenDialog: false }))
  }

  return (
    <>
      <Card>
        {respond.isLoading && <SimpleBackdrop />}
        <DataGrid
          autoHeight
          pagination
          rows={searchValue ? filteredRows : store.approvals}
          rowCount={store.approvals ? store.approvals.length : 0}
          columns={columns}
          sortingMode='client'
          rowSelection={false}
          className='no-border'
          localeText={{ noRowsLabel: 'No Approvals' }}
          loading={isLoading}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          disableColumnMenu
          slots={{
            toolbar: () => {
              return (
                <Toolbar searchValue={searchValue} handleFilter={handleSearch} label='Approval' />
              )
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
          {errorComment && (
            <FormHelperText sx={{ color: 'error.main' }}>Comment is required</FormHelperText>
          )}
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
  )
}

export default Approval
