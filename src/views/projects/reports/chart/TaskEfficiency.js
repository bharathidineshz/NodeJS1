// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import Icon from 'src/@core/components/icon'
import { Avatar, Grid } from '@mui/material'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useTheme } from '@emotion/react'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Styled component for the image
const Img = styled('img')({
  right: 7,
  bottom: 0,
  height: 177,
  position: 'absolute'
})

const TaskEfficiency = () => {
  const theme = useTheme()

  const data = {
    actual: '87',
    estimated: '92',
    title: 'Task Efficiency Index',
    trendNumber: '+38%',
    chipColor: 'primary',
    chipText: 'Year of 2023',
    src: '/images/cards/pose_f9.png'
  }

  const options = {
    chart: {
      sparkline: { enabled: true }
    },
    stroke: { lineCap: 'round' },
    colors: [theme.palette.info.main],
    plotOptions: {
      radialBar: {
        endAngle: 90,
        startAngle: -90,
        hollow: { size: '60%' },
        track: { background: theme.palette.customColors.trackBg },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: 0,
            fontWeight: 500,
            fontSize: '1.25rem',
            color: theme.palette.text.secondary
          }
        }
      }
    }
  }

  return (
    <Card sx={{ overflow: 'visible', position: 'relative' }}>
      <CardContent>
        <Box display='flex' justifyContent='space-between'>
          <Typography sx={{ mb: 6.5, fontWeight: 600 }}>{data.title}</Typography>
          <Avatar
            sx={{
              color: 'white',
              background: hexToRGBA(theme.palette.primary.main, 0.5),
              boxShadow: 3,
              mr: 4
            }}
          >
            <Icon icon='mdi:checkbox-marked-circle-auto-outline' />
          </Avatar>
        </Box>

        <Box
          sx={{
            mb: 1.5,
            columnGap: 8,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'space-evenly'
          }}
        >
          <Grid xs={12} display='flex'>
            <Grid item xs={7}>
              <ReactApexcharts type='radialBar' height={150} options={options} series={[81]} />
            </Grid>
            <Grid container xs={5} display='flex' sx={{ m: 'auto' }} flexDirection='column'>
              <Grid item>
                <Box
                  sx={{
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': { mr: 1.5, fontSize: '0.75rem', color: 'primary.main' }
                  }}
                >
                  <Icon icon='mdi:circle' />
                  <Typography variant='body2'>Actual</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600 }}>{data.actual}</Typography>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': {
                      mr: 1.5,
                      fontSize: '0.75rem',
                      color: hexToRGBA(theme.palette.primary.main, 0.7)
                    }
                  }}
                >
                  <Icon icon='mdi:circle' />
                  <Typography variant='body2'>Estimated</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600 }}>{data.estimated}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  )
}

export default TaskEfficiency
