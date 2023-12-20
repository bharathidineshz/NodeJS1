import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import ProjectsStats from 'src/views/projects/reports/ProjectsStats'
import { useDispatch, useSelector } from 'react-redux'
import { setProjectsDetails } from 'src/store/apps/projects'

const ProjectDetails = () => {
  const router = useRouter()
  const { id } = router.query

  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)

  return (
    <Grid>
      <ProjectsStats id={id} />
    </Grid>
  )
}

export default ProjectDetails
