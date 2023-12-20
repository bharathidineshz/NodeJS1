import { useState } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import TimesheetsDay from './timesheet-steps/timesheetsDay'
import TimesheetsWeek from './timesheet-steps/timesheetsWeek'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const AppTimeSheets = () => {
  const [view, setView] = useState('day') // State to manage active view

  // Function to handle view change
  const handleViewChange = newView => {
    setView(newView)
  }

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h6'>Time Sheets</Typography>

          <ButtonGroup variant='outlined'>
            <Button onClick={() => handleViewChange('day')} variant={view === 'day' ? 'contained' : 'outlined'}>
              Day
            </Button>
            <Button onClick={() => handleViewChange('week')} variant={view === 'week' ? 'contained' : 'outlined'}>
              Week
            </Button>
          </ButtonGroup>
        </Grid>

        <Grid item xs={12}>
          {view === 'day' ? <TimesheetsDay /> : <TimesheetsWeek />}
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default AppTimeSheets
