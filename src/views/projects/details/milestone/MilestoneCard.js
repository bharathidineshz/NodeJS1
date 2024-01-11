// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import { putMilestone, setEditMilestone } from 'src/store/apps/projects'

// ** Icon Imports
// import Icon from 'src/@core/components/icon'
import CategoriesTreeView from './CategoriesTreeView'
import { formatLocalDate } from 'src/helpers/dateFormats'
import { IconButton } from '@mui/material'
import { fetchMileStones, setMileStones } from 'src/store/apps/projects'
import { getItemDescriptor } from '@babel/core/lib/config/item'

const MileStoneCard = ({ data, setOpen }) => {

  const dispatch = useDispatch()
  const handleEdit = (item) => {
    setOpen(true)
    dispatch(setEditMilestone(item))
    console.log(item)
  }

  return (
    <Card sx={{ border: '1px solid #8039df', background: '#f5f5f5' }}>
      <CardContent sx={{ p: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
        <Box display='flex' justifyContent='space-between'>
          <Box>
            <Typography
              variant='h6'
              sx={{
                display: 'flex',
                mb: 2.75,
                alignItems: 'center',
                color: '#8039df',
                '& svg': { mr: 2.5 }
              }}
            >
              <Icon icon='mdi:flag-triangle' />
              {data.name}
            </Typography>
          </Box>
          <Box display='flex'>
            <Icon icon='mdi:calendar-outline' fontSize={20} color='grey' />
            <Typography
              variant='body2'
              sx={{ color: theme => (theme.palette.mode == 'light' ? 'text.primary' : 'grey') }}
            >
              {data.startDate}
            </Typography>
            <Icon icon='mdi:arrow-right' fontSize={20} color='grey' />
            <Typography
              variant='body2'
              sx={{ color: theme => (theme.palette.mode == 'light' ? 'text.primary' : 'grey') }}
            >
              {data.endDate}
            </Typography>

            <IconButton
              color='info'
              size='small'
              onClick={e => {
                handleEdit(data)
              }}
            >
              <Icon icon='mdi:edit-outline' fontSize={20} />
            </IconButton>

            <Typography
              variant='body2'
              sx={{ color: theme => (theme.palette.mode == 'light' ? 'text.primary' : 'grey') }}
            >
            </Typography>


          </Box>
        </Box>
        <Box>
          <Typography
            variant='caption'
            sx={{
              display: 'flex',
              mb: 2.75,
              alignItems: 'center',
              color: '#8039df',
              '& svg': { mr: 2.5 }
            }}
          >
            {data.description}
          </Typography>
        </Box>
        <CategoriesTreeView categories={data.taskCategories} />
      </CardContent>
    </Card>
  )
}

export default MileStoneCard

