// ** React Imports
import { useState, useEffect, useCallback, useMemo } from 'react'

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
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import Select from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, deleteUser, fetchUsers } from 'src/store/apps/user'

// ** Third Party Components
import axios from 'axios'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import { roles } from 'src/helpers/constants'

// ** Vars

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

// ** renders client column
const renderClient = row => {
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]

  return (
    <CustomAvatar
      skin='light'
      color={color}
      sx={{ mr: 3, width: 30, height: 30, fontSize: '.875rem' }}
    >
      {getInitials(row ? row : 'John Doe')}
    </CustomAvatar>
  )

  // }
}

const RowOptions = ({ id }) => {
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
    console.log(id)
    dispatch(deleteUser(id))
    handleRowOptionsClose()
  }

  const [editUserOpen, setEditUserOpen] = useState(false)
  const [addUserOpen, setAddUserOpen] = useState(false)

  const tongleEditDrawer = () => {
    return <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
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
        <MenuItem
          onClick={() => {
            console.log({ addUserOpen }), setAddUserOpen(!addUserOpen)
          }}
          sx={{ '& svg': { mr: 2 } }}
        >
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
    field: 'fullName',
    headerName: 'User',
    renderCell: ({ row }) => {
      // const { fullName, username } = row
      const fullName = `${row?.firstName} ${row?.lastName}`

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(fullName)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <LinkStyled href='/apps/user/view/overview/'>{fullName}</LinkStyled>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: 'email',
    headerName: 'Email',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant='body2'>
          {row.email}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    field: 'roleId',
    minWidth: 150,
    headerName: 'Role',
    renderCell: ({ value }) => {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            '& svg': { mr: 3, color: roles[Number(value)].color }
          }}
        >
          <Icon icon={roles[Number(value)].icon} fontSize={20} />
          <CustomChip size='small' label={roles[value].name} skin='light' color='primary' />
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Cost',
    field: 'currentPlan',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap sx={{ textTransform: 'capitalize' }}>
          {row.costPerHour}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => <RowOptions id={row.email} />
  }
]

const UserList = ({ apiData }) => {
  // ** State
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks

  const dispatch = useDispatch()
  const store = useSelector(state => state.user)
  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch, addUserOpen])

  const handleFilter = useCallback(val => {
    // Filter logic based on the 'val' (search text)
    setValue(val)
  }, [])

  const filteredData = useMemo(() => {
    let filtered = store.data // Assuming store.data contains the user data

    // Filter by search text
    if (value) {
      filtered = filtered.filter(
        user =>
          (user.fullName && user.fullName.toLowerCase().includes(value.toLowerCase())) ||
          (user.email && user.email.toLowerCase().includes(value.toLowerCase()))

        // Add more fields to search if needed
      )
    }

    // Filter by Role, Plan, and Status
    if (role) {
      filtered = filtered.filter(user => user.roleId === parseInt(role))
    }
    if (plan) {
      filtered = filtered.filter(user => user.currentPlan === plan)
    }
    if (status) {
      filtered = filtered.filter(user => user.status === status)
    }

    return filtered
  }, [store.data, value, role, plan, status])

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

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader />
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
          <DataGrid
            autoHeight
            rows={store.users}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
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

export default UserList
