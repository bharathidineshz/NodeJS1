// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'

// ** Third Party Imports
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjectsByUser } from 'src/store/apps/projects'
import { unwrapResult } from '@reduxjs/toolkit'

const Img = styled('img')(({ theme }) => ({
  width: 34,
  height: 34,
  borderRadius: '50%',
  marginRight: theme.spacing(3)
}))

const columns = [
  {
    flex: 0.3,
    minWidth: 230,
    field: 'projectId',
    headerName: 'Id',
  },
 
  {
    flex: 0.3,
    minWidth: 230,
    field: 'projectName',
    headerName: 'Project',
    renderCell: ({ row }) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Img src={row.img} alt={`project-${row.projectTitle}`} />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
            {row.projectTitle}
          </Typography>
          <Typography variant='caption'>{row.projectType}</Typography>
        </Box>
      </Box>
    )
  },
 
]

const InvoiceListTable = () => {
  // ** State
  const [value, setValue] = useState('')
  const [data, setData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)
  useEffect(() => {
    dispatch(fetchProjectsByUser())
      .then(unwrapResult)
      .then(res => setData(res.data))
  }, [value])

  return (
    <Card>
      <CardHeader title='Projects List' />
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Typography variant='body2' sx={{ mr: 2 }}>
            Search:
          </Typography>
          <TextField
            size='small'
            placeholder='Search Project'
            value={value}
            onChange={e => setValue(e.target.value)}
          />
        </Box>
      </CardContent>
      <DataGrid
        autoHeight
        rows={data}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Card>
  )
}

export default InvoiceListTable
