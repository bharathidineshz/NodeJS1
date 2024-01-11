// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const TableHeader = props => {
  // ** Props
  const { handleFilter, toggle, value } = props
  const [role, setRole] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Perform localStorage action
      const role = localStorage?.getItem('roleId')
      setRole(Number(role ? role : 0))
    }
  }, [])

  return (
    <Box
      sx={{
        pb: 3,
        pr: 6,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}
    >
      {/* <Button
        sx={{ mr: 4, mb: 2 }}
        color='secondary'
        variant='outlined'
        startIcon={<Icon icon='mdi:export-variant' fontSize={20} />}
      >
        Export
      </Button> */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder='Search User'
          onChange={e => handleFilter(e.target.value)}
        />

        {(role == 1 || role == 2 || role == 3) && (
          <Button sx={{ mb: 2 }} onClick={toggle} variant='contained'>
            Add User
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default TableHeader
