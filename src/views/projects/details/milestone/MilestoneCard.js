// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import CategoriesTreeView from './CategoriesTreeView'
import { formatLocalDate } from 'src/helpers/dateFormats'

const MileStoneCard = ({ data }) => {
  return (
    <Card sx={{ border: '1px solid #8039df', background: "#f5f5f5" }}>
      <CardContent sx={{ p: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
        <Box display="flex" justifyContent="space-between">
          <Typography
            variant='h6'
            sx={{ display: 'flex', mb: 2.75, alignItems: 'center', color: '#8039df', '& svg': { mr: 2.5 } }}
          >
            <Icon icon='mdi:flag-triangle' />
            {data.milestoneName}
          </Typography>
          <Box display="flex">
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {formatLocalDate(data.startDate)}
            </Typography>
            <Icon icon='mdi:arrow-right' fontSize={20} color="grey" />
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {formatLocalDate(data.endDate)}
            </Typography>
          </Box>
        </Box>
        <CategoriesTreeView categories={data.categories} />
      </CardContent>
    </Card>
  )
}

export default MileStoneCard
