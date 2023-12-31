// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Styled component for the image
const Img = styled('img')({
  right: 7,
  bottom: 0,
  height: 177,
  position: 'absolute'
})

const TaskCompletionRate = ({ details }) => {
  const { taskCompletionRate } = details

  const data = {
    stats: `${taskCompletionRate}%`,
    title: 'Task Completion Rate',
    chipColor: 'primary',
    chipText: 'Year of 2023',
    src: '/images/cards/pose_m18.png'
  }

  const {
    title,
    chipText,
    src,
    stats,
    trendNumber,
    trend = 'positive',
    chipColor = 'primary'
  } = data

  return (
    <Card sx={{ overflow: 'visible', position: 'relative' }}>
      <CardContent>
        <Img src={src} alt={title} />
        <Typography sx={{ mb: 6.5, fontWeight: 600 }}>{title}</Typography>
        <Box
          sx={{
            mb: 1.5,
            rowGap: 1,
            width: '55%',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start'
          }}
        >
          <Typography variant='h5' sx={{ mr: 1.5 }}>
            {stats}
          </Typography>
        </Box>
        <CustomChip
          size='small'
          skin='light'
          label={chipText}
          color={chipColor}
          sx={{
            height: 20,
            fontWeight: 500,
            fontSize: '0.75rem',
            '& .MuiChip-label': { lineHeight: '1.25rem' }
          }}
        />
      </CardContent>
    </Card>
  )
}

export default TaskCompletionRate
