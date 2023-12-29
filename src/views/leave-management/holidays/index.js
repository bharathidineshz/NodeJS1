// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import DatePicker from 'react-datepicker'
import { DataGrid } from '@mui/x-data-grid'
import TextField from '@mui/material/TextField'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** ThirdParty Components
import axios from 'axios'
import dayjs from 'dayjs'

// ** Custom Table Components Imports
import SidebarAddHoliday from 'src/views/pages/account-settings/holiday/AddHolidayDrawer'

// ** Apimethod and Endpoints
import { endpointURL, endpoints } from 'src/store/endpoints/endpoints'

import { fetchHolidays, deleteHoliday, updateHoliday } from 'src/store/apps/accountSetting/index'
import SimpleBackdrop from 'src/@core/components/spinner'
import { formatDateToYYYYMMDD, formatLocalDate } from 'src/helpers/dateFormats'
import HolidayForm from './HolidayForm'
import FallbackSpinner from 'src/layouts/components/LogoSpinner'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'
import { unwrapResult } from '@reduxjs/toolkit'

const DynamicDeleteAlert = dynamic(() => import('src/views/components/alerts/DeleteAlert'), {
  ssr: false,
  loading: () => {
    return <FallbackSpinner />
  }
})

const Holidays = ({ popperPlacement }) => {
  // ** State
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const { holidays } = useSelector(state => state.accountSetting)
  const [row, setRowData] = useState({})
  const [rows, setRows] = useState([])
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [renderDatagrid, setRenderDatagrid] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [leaveDescription, setLeaveDescription] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [formOpen, setForm] = useState(false)
  const [alert, setAlert] = useState(false)
  const [filteredRows, setFilteredRows] = useState([])
  const [searchValue, setSearchValue] = useState('')

  const dispatch = useDispatch()

  const columns = [
    {
      field: 'date',
      headerName: 'Holiday',
      type: 'date',
      width: 300,
      editable: true,
      renderCell: params => <div>{formatLocalDate(params.value)}</div>
    },
    {
      flex: 1,
      field: 'leaveDescription',
      headerName: 'Description',
      editable: true
    },
    {
      flex: 0.3,
      field: 'action',
      type: 'actions',
      headerName: 'Actions',
      cellClassName: 'actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size='small'
            color='error'
            onClick={() => {
              setAlert(true), setRowData(row)
            }}
          >
            <Icon icon='mdi:delete-outline' fontSize={20} />
          </IconButton>
        </Box>
      )
    }
  ]

  useEffect(() => {
    setLoading(true)
    dispatch(fetchHolidays()).then(res => setLoading(false))
  }, [])

  useEffect(() => {
    let holidaysvalues = holidays?.map(e => ({
      ...e,
      date: new Date(e?.date)
    }))
    setRows(holidaysvalues)
    console.log('holidaysvalues', holidaysvalues)
  }, [holidays])

  const getHolidays = () => {
    dispatch(fetchHolidays())
  }

  const toggleAddUserDrawer = () => {
    setAddUserOpen(!addUserOpen)
  }

  const handleRowClick = data => {
    setRowData(data.row)
    setForm(true)
  }

  const handleSearch = value => {
    setSearchValue(value)
    const filteredRows = rows.filter(o =>
      o.leaveDescription.toLowerCase().trim().includes(value) ||
      o.date.toDateString().includes(value) 
    )
    setFilteredRows(filteredRows)
  }

  const handleDelete = () => {
    try {
      dispatch(
        deleteHoliday([
          {
            id: row.id,
            date: formatDateToYYYYMMDD(row.date),
            leaveDescription: row.leaveDescription
          }
        ])
      )
        .then(unwrapResult)
        .then(res => {
          if (res?.status == 200 || res.status == 201) {
            setAlert(false)
            toast.success(res.data)
            dispatch(fetchHolidays())
          } else {
            setAlert(true)
            toast.error(res.data)
          }
        })
    } catch (error) {
      toast.error(error)
    }
  }

  return (
    <Card>
      <DatePickerWrapper>
        <Box
          sx={{
            p: 5,
            pb: 3,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'end'
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size='small'
              sx={{ mr: 4, mb: 2 }}
              placeholder='Search Holiday'
              onChange={e => handleSearch(e.target.value)}
            />

            <Button sx={{ mb: 2 }} onClick={() => toggleAddUserDrawer()} variant='contained'>
              Add Holiday
            </Button>
          </Box>
        </Box>
        <Grid>
          <DataGrid
            autoHeight
            rows={searchValue ? filteredRows : rows || []}
            columns={columns}
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
            pageSizeOptions={[10, 25, 50]}
          />
        </Grid>
      </DatePickerWrapper>
      <SidebarAddHoliday open={addUserOpen} toggle={toggleAddUserDrawer}></SidebarAddHoliday>
      <HolidayForm isOpen={formOpen} row={row} setOpen={setForm} />
      <DynamicDeleteAlert
        open={alert}
        setOpen={setAlert}
        title='Delete Holiday'
        content='Are you confirm to delete holiday?'
        action='Delete'
        handleAction={handleDelete}
      />
    </Card>
  )
}

export default Holidays
