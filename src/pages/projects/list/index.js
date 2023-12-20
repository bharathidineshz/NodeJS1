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
import {
  fetchProjects,
  fetchUsers,
  fetchClients,
  setProject,
  deleteProject,
  getProjectDetails,
  setSelectedProject
} from 'src/store/apps/projects'
import { Icon } from '@iconify/react'
import OptionsMenu from 'src/@core/components/option-menu'
import FallbackSpinner from 'src/@core/components/spinner'
import { unwrapResult } from '@reduxjs/toolkit'
import { useRouter } from 'next/router'

const TableServerSide = () => {
  // ** States
  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState('asc')
  const [rows, setRows] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)
  const router = useRouter()

  useEffect(() => {
    dispatch(fetchUsers())
    dispatch(fetchClients())
    dispatch(fetchProjects())
      .then(unwrapResult)
      .then(() => {
        setLoading(false)
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
      headerName: 'Name'
    },
    {
      flex: 0.2,
      minWidth: 120,
      headerName: 'Client',
      field: 'clientName'
    },
    {
      flex: 0.4,
      minWidth: 200,
      headerName: 'Assignees',
      field: 'assignee',
      renderCell: params => (
        <Grid sx={{ display: 'flex' }}>
          {params.value.map((user, index) => (
            <AvatarGroup key={index} className='pull-up' max={4}>
              <Tooltip key={index} title={user.userName}>
                {renderUsers(user)}
              </Tooltip>
            </AvatarGroup>
          ))}
        </Grid>
      )
    },
    {
      flex: 0.175,
      minWidth: 110,
      field: 'budget',
      headerName: 'Budget'
    },
    {
      flex: 0.1,
      field: 'hours',
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

  const handleSearch = value => {
    setSearchValue(value)
    fetchTableData(sort, value, sortColumn)
  }

  const handleProjectSelection = data => {
    // console.log('row', data)
    // dispatch(getProjectDetails(data.row.uniqueId))
    // dispatch(setSelectedProject(data.row))

    router.push({
      pathname: '//projects/details/task',
      query: { returnUrl: router.asPath }
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
            rows={[
              {
                id: 1,
                name: 'ADAT',
                clientName: 'Telerad',
                assignee: [{ userName: 'Naveenkumar Mounasamy' }],
                budget: 15000,
                hours: 120,
                isBillable: true
              }
            ]}
            rowCount={store.allProjects.length}
            columns={columns}
            sortingMode='server'
            checkboxSelection
            paginationMode='server'
            rowSelection={false}
            onRowClick={handleProjectSelection}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            paginationModel={paginationModel}
            onSortModelChange={handleSortModel}
            slots={{ toolbar: Toolbar }}
            onPaginationModelChange={setPaginationModel}

            // loading={store.allProjects.length === 0}
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
