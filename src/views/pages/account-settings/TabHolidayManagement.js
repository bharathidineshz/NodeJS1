// ** React Imports
import { useState, useEffect } from 'react'

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
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'
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
import SidebarAddHoliday from './holiday/AddHolidayDrawer'

// ** Apimethod and Endpoints
import { endpointURL, endpoints } from 'src/store/endpoints/endpoints'

import { fetchHolidays, deleteHoliday, updateHoliday } from 'src/store/apps/accountSetting/index'

const TabHolidayManagement = ({ popperPlacement }) => {
  // ** State
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const { holidays } = useSelector(state => state.accountSetting)
  const [rows, setRows] = useState([])
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [renderDatagrid, setRenderDatagrid] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [leaveDescription, setLeaveDescription] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    getHolidays()
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
    setLeaveDescription(null)
  }

  const handleDateChange = (date, params) => {
    setSelectedDate(date)
    if (date instanceof Date && !isNaN(date)) {
      let testing = {
        ...params,
        row: { ...params.row, date: dayjs(date).format('YYYY-MM-DD') }
      }
      updateHolidayDet(testing.row)
      getHolidays()
    }
  }

  const handleChange = (value, params) => {
    if (value != '' && event.target.value != undefined) {
      let testing = {
        ...params,
        row: {
          ...params.row,
          leaveDescription: value,
          date: dayjs(params.row.date).format('YYYY-MM-DD')
        }
      }

      updateHolidayDet(testing.row)
    }
  }

  const updateHolidayDet = payload => {
    dispatch(updateHoliday([payload]))
    setSelectedDate(null)
  }

  const renderTable = () => {
    if (renderDatagrid) {
      getHolidays()
      setRenderDatagrid(false)
    }
  }

  const toggleAddUserDrawer = () => {
    setAddUserOpen(!addUserOpen)
  }

  const columns = [
    {
      field: 'date',
      headerName: 'Holiday',
      type: 'date',
      width: 300,
      editable: true,
      renderEditCell: params => (
        <DatePicker
          selected={selectedDate ?? params?.row?.date}
          id='basic-input'
          popperPlacement={popperPlacement}
          onChange={date => {
            setRenderDatagrid(true)
            handleDateChange(date, params)
          }}
          // onBlur={(e) => { debugger; }}
          customInput={<CustomInput label='Date' fullWidth sx={{ border: 'none' }} />}
        />
      )
    },
    {
      field: 'leaveDescription',
      headerName: 'Description',
      width: 400,
      editable: true,
      renderEditCell: params => (
        <TextField
          value={leaveDescription ?? params?.row?.leaveDescription}
          onChange={e => {
            setLeaveDescription(e.target.value)
          }}
          fullWidth
          onBlur={e => {
            handleChange(leaveDescription, params)
          }}

          // sx={{ border: "none" }}
        />
      )
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Delete Holiday'>
            <IconButton
              size='small'
              onClick={() => {
                dispatch(deleteHoliday([row]))
              }}
            >
              <Icon icon='mdi:delete-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <div onMouseUp={() => renderTable()}>
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

                // onChange={e => handleFilter(e.target.value)}
              />

              <Button sx={{ mb: 2 }} onClick={() => toggleAddUserDrawer()} variant='contained'>
                Add Holiday
              </Button>
            </Box>
          </Box>
          <Grid>
            <DataGrid
              autoHeight
              rows={rows}
              columns={columns}
              // checkboxSelection
              // disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}

              // getRowId={(row) => row.code + '_' + row.type}
            />
            <SidebarAddHoliday open={addUserOpen} toggle={toggleAddUserDrawer}></SidebarAddHoliday>
          </Grid>
        </DatePickerWrapper>
      </Card>
    </div>
  )
}

export default TabHolidayManagement
