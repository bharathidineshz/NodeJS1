// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const SalesOverview = () => {
  // ** Hook
  const theme = useTheme()

  const options = {
    chart: {
      sparkline: { enabled: true }
    },
    colors: [
      theme.palette.primary.main,
      hexToRGBA(theme.palette.primary.main, 0.7),
      hexToRGBA(theme.palette.primary.main, 0.5),
      theme.palette.customColors.trackBg
    ],
    stroke: { width: 0 },
    legend: { show: false },
    dataLabels: { enabled: false },
    labels: ['Current Projects', 'New Projects', 'Upcoming Closures', 'Outcoming Resources'],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    plotOptions: {
      pie: {
        customScale: 0.9,
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              offsetY: 25,
              fontSize: '0.875rem',
              color: theme.palette.text.secondary
            },
            value: {
              offsetY: -15,
              fontWeight: 500,
              formatter: value => `${value}`,
              color: theme.palette.text.primary
            },
            total: {
              show: true,
              fontSize: '0.875rem',
              label: 'Overall Projects',
              color: theme.palette.text.secondary,
              formatter: value => `${value.globals.seriesTotals.reduce((total, num) => total + num)}`
            }
          }
        }
      }
    }
  }

  return (
    <Card>
      <CardHeader
        title='Project Overview'
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}

      // action={
      //   <OptionsMenu
      //     options={['Last 28 Days', 'Last Month', 'Last Year']}
      //     iconButtonProps={{ size: 'small', sx: { color: 'text.primary' } }}
      //   />
      // }
      />
      <CardContent>
        <Grid container sx={{ my: [0, 4, 1.625] }}>
          <Grid item xs={12} sm={6} sx={{ mb: [3, 0] }}>
            <ReactApexcharts type='donut' height={220} series={[12, 8]} options={options} />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ my: 'auto' }}>

            <Grid container>
              <Grid item xs={12} sx={{ mb: 4 }}>
                <Box
                  sx={{
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': { mr: 1.5, fontSize: '0.75rem', color: 'primary.main' }
                  }}
                >
                  <Icon icon='mdi:circle' />
                  <Typography variant='body2'>Current Projects</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600 }}>12</Typography>
              </Grid>
              <Grid item xs={12} sx={{ mb: 4 }}>
                <Box
                  sx={{
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': { mr: 1.5, fontSize: '0.75rem', color: hexToRGBA(theme.palette.primary.main, 0.7) }
                  }}
                >
                  <Icon icon='mdi:circle' />
                  <Typography variant='body2'>New Projects</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600 }}>8</Typography>
              </Grid>
               
              
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default SalesOverview
