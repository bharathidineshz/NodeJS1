// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'

// ** ThirdParty Components
import axios from 'axios'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import Toolbar from 'src/views/projects/list/toolBar'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { AvatarGroup, Button, Grid, IconButton, Tooltip } from '@mui/material'
import Link from 'next/link'
import ProjectHeader from 'src/views/projects/list/Header'
import { useDispatch, useSelector } from 'react-redux'
import { fetchClients, fetchProjects, fetchUsers, setSelectedProject } from 'src/store/apps/projects'
import { Icon } from '@iconify/react'
import OptionsMenu from 'src/@core/components/option-menu'
import FallbackSpinner from 'src/@core/components/spinner'
import { unwrapResult } from '@reduxjs/toolkit'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

const TableServerSide = () => {
  // ** States
  const [sort, setSort] = useState('asc')
  const [filteredRows, setRows] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)
  const router = useRouter()

  useEffect(() => {
    setLoading(true);
    dispatch(fetchUsers())
    dispatch(fetchClients())
      .then(unwrapResult)
      .then(() => {
        dispatch(fetchProjects()).then(res => setLoading(false))
      })
  }, [dispatch, searchValue, sort, sortColumn])

  const columns = [
    // {
    //   flex: 0.1,
    //   field: 'id',
    //   minWidth: 80,
    //   headerName: 'Id'
    // },
    {
      flex: 0.3,
      minWidth: 200,
      field: 'name',
      headerName: 'Name',
      renderCell: params => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <LinkStyled href=''>{params.value}</LinkStyled>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 120,
      headerName: 'Client',
      field: 'clientName'
    },

    {
      flex: 0.175,
      minWidth: 110,
      field: 'budget',
      headerName: 'Budget'
    },
    {
      flex: 0.1,
      field: 'estimatedHours',
      minWidth: 80,
      headerName: 'Hours'
    },
    {
      flex: 0.08,
      minWidth: 100,
      field: 'isBillable',
      headerName: 'Billable',
      renderCell: params => (
        <Grid>
          {params.value ? (
            <CustomAvatar skin='light' color='success'>
              <Icon icon='mdi:checkbox-marked-circle-outline' />
            </CustomAvatar>
          ) : (
            <CustomAvatar skin='light' color='error'>
              <Icon icon='mdi:close-circle-outline' />
            </CustomAvatar>
          )}
        </Grid>
      )
    },
    {
      flex: 0.08,
      minWidth: 100,
      field: 'isActive',
      headerName: 'Active',
      renderCell: params => (
        <Grid>
          {params.value ? (
            <CustomAvatar skin='light' color='success'>
              <Icon icon='mdi:checkbox-marked-circle-outline' />
            </CustomAvatar>
          ) : (
            <CustomAvatar skin='light' color='error'>
              <Icon icon='mdi:close-circle-outline' />
            </CustomAvatar>
          )}
        </Grid>
      )
    }
  ]

  const handleSortModel = newModel => {
    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)
      fetchTableData(newModel[0].sort, searchValue, newModel[0].field)
    } else {
      setSort('asc')
      setSortColumn('full_name')
    }
  }

  // ** renders client column
  const renderUsers = params => {
    const stateNum = Math.floor(Math.random() * 6)
    const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
    const color = states[stateNum]
    const user = store.users?.find(o => o.id === params.userId)
    const fullName = `${user?.firstName} ${user?.lastName}`

    return (
      <CustomAvatar
        skin='light'
        color={color}
        sx={{ mr: 1, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
      >
        {getInitials(fullName ? fullName : 'Unkown User')}
      </CustomAvatar>
    )
  }
  
//SEARCH
  const handleSearch = value => {
    setSearchValue(value)
    const rows = store.allProjects.filter(
      o =>
        o.name.toLowerCase().trim().includes(value) ||
        o.clientName.toLowerCase().trim().includes(value) ||
        o.budget?.toString().toLowerCase().trim().includes(value) ||
        o.estimatedHours?.toString().toLowerCase().trim().includes(value)
    )
    setRows(rows)
  }

  const handleProjectSelection = data => {
    dispatch(setSelectedProject(data.row))
    localStorage.setItem("project", JSON.stringify(data.row))
    localStorage.setItem("projectId", data.row.id)

    router.push({
      pathname: '/projects/details/task',
    })
  }

  return (
    <>
      {isLoading ? (
        <FallbackSpinner />
      ) : (
        <Card>
          <ProjectHeader />
          <DataGrid
            autoHeight
            pagination
            // rows={store.allProjects}
            rows={searchValue ? filteredRows : store.allProjects || []}
            columns={columns}
            sortingMode='server'
            paginationMode='server'
            rowSelection={false}
            onRowClick={handleProjectSelection}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            paginationModel={paginationModel}
            onSortModelChange={handleSortModel}
            slots={{
              toolbar: () => {
                return <Toolbar searchValue={searchValue} handleFilter={handleSearch} isExport />
              }
            }}
            onPaginationModelChange={setPaginationModel}
            slotProps={{
              baseButton: {
                variant: 'outlined'
              },
              toolbar: {
                value: searchValue,
                clearSearch: () => handleSearch(''),
                onChange: event => handleSearch(event.target.value)
              }
            }}
          />
        </Card>
      )}
    </>
  )
}

export default TableServerSide
