// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
// ** Utils Import

// ** Actions Imports
import { fetchData, deleteUser, deleteClient, fetchClients } from 'src/store/clients'

// ** Third Party Components
import axios from 'axios'

// ** Custom Table Components Imports
import ClientTableHeader from 'src/views/clients/list/ClientTableHeader'
import AddClientDrawer from 'src/views/clients/list/AddClientDrawer'

// ** Vars
const userRoleObj = {
  admin: { icon: 'mdi:laptop', color: 'error.main' },
  author: { icon: 'mdi:cog-outline', color: 'warning.main' },
  editor: { icon: 'mdi:pencil-outline', color: 'info.main' },
  maintainer: { icon: 'mdi:chart-donut', color: 'success.main' },
  subscriber: { icon: 'mdi:account-outline', color: 'primary.main' }
}

const userStatusObj = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

const RowOptions = ({ id, rowData, onEdit }) => {
  // ** Hooks
  const dispatch = useDispatch()

  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    console.log([id])
    dispatch(deleteClient([id]))
    handleRowOptionsClose()
  }

  const handleEditClick = () => {
    console.log(rowData)
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='mdi:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          onClick={handleRowOptionsClose}
          href='/apps/user/view/overview/'
        >
          <Icon icon='mdi:eye-outline' fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={handleEditClick} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

const columns = [
  {
    flex: 0.2,
    minWidth: 230,
    field: 'ClientName',
    headerName: 'Client',
    renderCell: ({ row }) => {
      const { clientName } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <LinkStyled href='/apps/user/view/overview/'>{clientName}</LinkStyled>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: 'email',
    headerName: 'Email'
  },
  {
    flex: 0.15,
    field: 'taxId',
    minWidth: 150,
    headerName: 'Tax Id'
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'CompanyId',
    field: 'CompanyId',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap sx={{ textTransform: 'capitalize' }}>
          {row.companyId}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Active',
    field: 'isActive',
    renderCell: (params) => (
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
    ),
  },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: 'actions',
    headerName: 'Actions'
  }
]

const ClientList = ({ apiData }) => {
  // ** State
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [editedRowData, setEditedRowData] = useState(null)
  const [filteredData, setFilteredData] = useState([])

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.clients)
  console.log(store.clients)

  useEffect(() => {
    dispatch(fetchClients())
  }, [dispatch, store.clients])

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const handleRoleChange = useCallback(e => {
    setRole(e.target.value)
  }, [])

  const handlePlanChange = useCallback(e => {
    setPlan(e.target.value)
  }, [])

  const handleStatusChange = useCallback(e => {
    setStatus(e.target.value)
  }, [])
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  const handleEdit = rowData => {
    setEditedRowData(rowData)
    toggleAddUserDrawer() // Open the drawer
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader />

          {/* <Divider /> */}
          <ClientTableHeader value={value} handleFilter={handleFilter} />
          <DataGrid
            autoHeight
            rows={store.clients}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      <AddClientDrawer
        open={addUserOpen}
        toggle={toggleAddUserDrawer}
        handleEdit={handleEdit}
        editedRowData={editedRowData}
      />
    </Grid>
  )
}

export const getStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData = res.data

  return {
    props: {
      apiData
    }
  }
}

export default ClientList
