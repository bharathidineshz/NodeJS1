import { Button, CardHeader } from '@mui/material'
import { Box } from '@mui/system'
import Link from 'next/link'
import React from 'react'

const ProjectHeader = () => {
  return (
    <div>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <CardHeader  />
        {/* <Button sx={{ mr: 5 }} component={Link} variant='contained' href='/apps/projects/add'>
          Create Project
        </Button> */}
      </Box>
    </div>
  )
}

export default ProjectHeader
