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
import { useRouter } from 'next/router'
import { unwrapResult } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { handleResponse } from 'src/helpers/helpers'

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
  useEffect(() => {
    dispatch(fetchClients())
  }, [])

  const handleFilter = useCallback(
    value => {
      setValue(value)
      const data = store.clients.map(o => ({
        ...o,
        companyName: o.companyName.toLowerCase(),
        primaryContatctName: o.primaryContatctName.toLowerCase(),
        phoneNumber: o.phoneNumber.toLowerCase(),
        email: o.email.toLowerCase(),
        address: o.address.toLowerCase(),
        taxId: o.taxId.toLowerCase()
      }))
      const filteredRows = data.filter(
        o =>
          o.companyName.trim().includes(value.toLowerCase()) ||
          o.primaryContatctName.trim().includes(value.toLowerCase()) ||
          o.phoneNumber.trim().includes(value.toLowerCase()) ||
          o.email.trim().includes(value.toLowerCase()) ||
          o.address.trim().includes(value.toLowerCase()) ||
          o.taxId.trim().includes(value.toLowerCase())
      )
      const _data = data.filter(o => filteredRows.some(f => f.id == o.id))
      setFilteredData(_data)
    },
    [value]
  )

  const columns = [
    {
      flex: 0.2,
      field: 'companyName',
      headerName: 'Company Name',
      renderCell: ({ row }) => {
        const { companyName } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <LinkStyled href=''>{companyName}</LinkStyled>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.175,
      field: 'email',
      headerName: 'Email',
      wrap: true,
      renderCell: params => <div style={{ whiteSpace: 'pre-line' }}>{params.value}</div>
    },
    {
      flex: 0.16,
      field: 'primaryContatctName',
      headerName: 'Contact',
      renderCell: params => <div style={{ whiteSpace: 'pre-line' }}>{params.value}</div>
    },
    {
      flex: 0.17,
      field: 'phoneNumber',
      minWidth: 150,
      headerName: 'Phone'
    },
    {
      flex: 0.15,
      field: 'taxId',
      minWidth: 150,
      headerName: 'Tax Id'
    },
    {
      flex: 0.15,
      width: 120,
      headerName: 'Address',
      field: 'address',
      renderCell: params => <div style={{ whiteSpace: 'pre-line' }}>{params.value}</div>
    },
    {
      flex: 0.1,
      minWidth: 120,
      headerName: 'Active',
      field: 'isActive',
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
      flex: 0.1,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconButton color='info' size='small' onClick={handleEdit(params.row)}>
            <Icon icon='mdi:edit-outline' fontSize={20} />
          </IconButton>
          <IconButton color='error' size='small' onClick={handleDelete(params.row.id)}>
            <Icon icon='mdi:trash-outline' fontSize={20} />
          </IconButton>
        </Box>
      )
    }
  ]

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

  const openNewClient = () => {
    setEditedRowData(null)
    toggleAddUserDrawer()
  }

  const handleEdit = rowData => e => {
    setEditedRowData(rowData)
    toggleAddUserDrawer() // Open the drawer
  }

  const handleDelete = id => e => {
    const successFunction = () => {
      dispatch(fetchClients())
    }

    dispatch(deleteClient(id))
      .then(unwrapResult)
      .then(res => {
        handleResponse('delete', res, successFunction)
      })
      .catch(err => {
        toast.error(err.message)
      }) // Open the drawer
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader />
          {/* <Divider /> */}
          <ClientTableHeader setOpen={openNewClient} value={value} handleFilter={handleFilter} />
          <DataGrid
            autoHeight
            rows={value ? filteredData : store.clients}
            columns={columns}
            disableRowSelectionOnClick
            disableColumnMenu
            sortingMode='client'
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            localeText={{ noRowsLabel: 'No Clients' }}
          />
        </Card>
      </Grid>

      <AddClientDrawer
        open={addUserOpen}
        toggle={toggleAddUserDrawer}
        handleEdit={handleEdit}
        editedRowData={editedRowData}
        setEditedRowData={setEditedRowData}
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
