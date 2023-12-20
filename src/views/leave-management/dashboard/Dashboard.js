// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getRandomColor } from 'src/helpers/helpers'

const RADIAN = Math.PI / 180

const renderCustomizedLabel = props => {
  // ** Props
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill='#fff' textAnchor='middle' dominantBaseline='central'>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const LeaveDashboard = () => {
  const [data, setData] = useState([])
  const dispatch = useDispatch()
  const store = useSelector(state => state.leaveManagement)

  useEffect(() => {
    const _data = []

    store.dashboards.totalLeaves?.forEach((p, i) => {
      _data.push({
        name: p.name,
        value: p.totalCount,
        color: getRandomColor()
      })
    })

    setData(_data)
  }, [store.dashboards])

  return (
    <Card>
      <CardHeader
        title='Total Leaves'
        subheaderTypographyProps={{
          sx: { color: theme => `${theme.palette.text.disabled} !important` }
        }}
      />
      <CardContent>
        <Box sx={{ height: 280 }}>
          <ResponsiveContainer>
            <PieChart style={{ direction: 'ltr' }}>
              <Pie data={data} innerRadius={50} dataKey='value' label={data} labelLine={false}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 4, justifyContent: 'center' }}>
          {data.map((item, key) => (
            <Box
              key={key}
              sx={{
                mr: 6,
                display: 'flex',
                alignItems: 'center',
                '& svg': { mr: 1.5, color: item.color }
              }}
            >
              <Icon icon='mdi:circle' fontSize='0.75rem' />
              <Typography variant='body2'>{item.name}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default LeaveDashboard
