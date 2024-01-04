// ** React Imports
import { useState, useEffect, useMemo } from 'react'

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
    flex: 1,
    field: 'projectName',
    headerName: 'Project',
    renderCell: ({ row }) => (
      // <Box sx={{ display: 'flex', alignItems: 'center' }}>
      // <Img src={row.img} alt={`project-${row.projectTitle}`} />
      // <Box sx={{ display: 'flex', flexDirection: 'column' }}>

      <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
        {row.projectName}
      </Typography>

      // <Typography variant='caption'>{row.projectType}</Typography>
      // </Box>
      // </Box>
    )
  }
]

const InvoiceListTable = () => {
  // ** State
  const [value, setValue] = useState('')
  const [data, setData] = useState([])
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)

  useEffect(() => {
    dispatch(fetchProjectsByUser())
      .then(unwrapResult)
      .then(res => {
        setData(res)
      })
  }, [])

  const filteredData = useMemo(() => {
    let filtered = data // Assuming store.data contains the user data

    // Filter by search text
    if (value) {
      filtered = filtered.filter(
        item => item.projectName && item.projectName.toLowerCase().includes(value.toLowerCase())
        // Add more fields to search if needed
      )
    }

    return filtered
  }, [data, value])

  return (
    <Card>
      <CardHeader title='Projects List' />
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
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
        rows={filteredData || []}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 25, 50]}
        getRowId={row => row.projectId}
        disableColumnMenu
        localeText={{ noRowsLabel: 'No Projects' }}
      />
    </Card>
  )
}

export default InvoiceListTable
