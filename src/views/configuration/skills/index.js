// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { IconButton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from '@iconify/react'
import FallbackSpinner from 'src/@core/components/spinner'
import { unwrapResult } from '@reduxjs/toolkit'
import Toolbar from 'src/views/leave-management/toolBar'
import { deletePolicy, fetchPolicies } from 'src/store/leave-management'
import instance, { base } from 'src/store/endpoints/interceptor'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'
import { endpoints } from 'src/store/endpoints/endpoints'
import axios from 'axios'
import { deleteSkill } from 'src/store/settings'
import { fetchRequiredSkills } from 'src/store/apps/projects'

const DynamicEditSkill = dynamic(() => import('src/views/configuration/skills/EditSkill'), {
  ssr: false,
  loading: () => {
    return <FallbackSpinner />
  }
})

const DynamicDeleteAlert = dynamic(() => import('src/views/components/alerts/DeleteAlert'), {
  ssr: false,
  loading: () => {
    return <FallbackSpinner />
  }
})

const SkillsConfig = ({ data }) => {
  // ** States
  const [isLoading, setLoading] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [rowData, setRowData] = useState({})
  const [alert, setOpenAlert] = useState(false)
  const [filteredRows, setFilteredRows] = useState([])
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)

  useEffect(() => {
    setOpen(false)
    dispatch(fetchRequiredSkills())
  }, [alert])

  const columns = [
    {
      flex: 0.6,
      field: 'skillName',
      headerName: 'Skill',
      renderCell: params => <div style={{ fontWeight: 'bold' }}>{params.value}</div>
    },
    {
      flex: 0.08,
      headerName: 'Action',
      field: 'action',
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={() => {
              setOpen(false), setRowData(row), setOpenAlert(!alert)
            }}
            color='error'
          >
            <Icon icon='mdi:delete-outline' fontSize={20} />
          </IconButton>
        </Box>
      )
    }
  ]

  //delete

  const handleDelete = () => {
    try {
      dispatch(deleteSkill(rowData?.id))
        .then(unwrapResult)
        .then(res => {
          if (res.status === 200) {
            setOpenAlert(!alert)
            dispatch(fetchPolicies())
            toast.success(res.data)
          } else {
            toast.error(res.data)
          }
        })
    } catch (error) {
      toast.error(error.message)
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

    const rows = store.requiredSkills.filter(l => l.skillName.toLowerCase().trim().includes(value))
    setFilteredRows(rows)
  }

  const handleRowSelection = data => {
    console.log('row', data)
    setOpen(true)
    setRowData(data.row)
  }

  return (
    <>
      {isLoading ? (
        <FallbackSpinner />
      ) : (
        <>
          <Card>
            <DataGrid
              autoHeight
              pagination
              rows={searchValue ? filteredRows : store.requiredSkills}
              columns={columns}
              rowSelection={false}
              onCellClick={data => data.field != 'action' && handleRowSelection(data)}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              className='no-border'
              disableColumnMenu={true}
              loading={store.requiredSkills?.length === 0}
              localeText={{ noRowsLabel: 'No Skills' }}
              slots={{
                toolbar: () => {
                  return (
                    <Toolbar searchValue={searchValue} handleFilter={handleSearch} label='Skill' />
                  )
                }
              }}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 25
                  }
                }
              }}
            />
          </Card>

          <DynamicEditSkill isOpen={isOpen} row={rowData} setOpen={setOpen} />
          <DynamicDeleteAlert
            open={alert}
            setOpen={setOpenAlert}
            title='Delete Skill'
            content='Are you confirm to delete skill?'
            action='Delete'
            handleAction={handleDelete}
          />
        </>
      )}
    </>
  )
}

export async function getStaticProps() {
  // Use Axios to fetch data from an API with headers
  const response = await axios.get(base.url + endpoints.getLeavePolicy, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`
    }
  })
  const { data } = response

  return {
    props: {
      data
    }
  }
}

export default SkillsConfig
