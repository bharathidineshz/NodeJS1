import {
  Autocomplete,
  Button,
  CircularProgress,
  Grid,
  TextField,
  useMediaQuery
} from '@mui/material'
import React, { memo, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useDispatch, useSelector } from 'react-redux'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { fetchUserReports } from 'src/store/leave-management'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

const ReportsHeader = () => {
  const [report, setReport] = useState({
    user: null,
    start: new Date(),
    end: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
    isExportDisabled: true,
    isLoading: false
  })
  const dispatch = useDispatch()
  const store = useSelector(state => state.leaveManagement)
  const isSM = useMediaQuery(theme => theme.breakpoints.up('sm'))

  const handleOnChange = dates => {
    const [start, end] = dates
    setReport(prev => ({ ...prev, start: start, end: end }))
  }

  const getReports = async () => {
    await dispatch(
      fetchUserReports({
        userId: report.user?.id,
        fromDate: report.start?.toISOString(),
        toDate: report.end?.toISOString()
      })
    )
  }

  return (
    <Grid display='flex' flexWrap='wrap' justifyContent='start' columnGap={6} sx={{ m: 5 }}>
      <Grid xs={12} sm={4} sx={{ pt: theme => `${theme.spacing(4)} !important` }}>
        <Autocomplete
          options={store.users}
          id='autocomplete-limit-tags'
          getOptionLabel={option => option.fullName}
          value={report.user}
          onChange={(e, value) => setReport(report => ({ ...report, user: value }))}
          renderInput={params => <TextField {...params} label='Search User' placeholder='User' />}
        />
      </Grid>
      <Grid xs={12} sm={4} sx={{ pt: theme => `${theme.spacing(4)} !important` }}>
        <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
          <DatePicker
            selectsRange
            endDate={report.end}
            selected={report.start}
            startDate={report.start}
            id='date-range-picker'
            onChange={handleOnChange}
            shouldCloseOnSelect
            popperPlacement='auto'
            dateFormat='dd-MMM-yy'
            customInput={<CustomInput label='Date Range' start={report.start} end={report.end} />}
          />
        </DatePickerWrapper>
      </Grid>

      <Grid
        sx={{
          pt: theme => `${theme.spacing(4)} !important`,
          display: 'flex',
          alignItems: 'center',
          gap: 4
        }}
      >
        {/* <Button variant='outlined' color='secondary' disabled={report.isExportDisabled}>
          Export
        </Button> */}
        <Button variant='contained' onClick={getReports} disabled={report.user == null}>
          Get Report
        </Button>
      </Grid>
    </Grid>
  )
}

export default ReportsHeader
