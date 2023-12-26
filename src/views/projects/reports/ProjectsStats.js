import { Grid } from '@mui/material'
import React, { memo, useEffect, useState } from 'react'
import BurnedCostPie from 'src/views/projects/reports/chart/ApexDonutChart'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import ProjectProfit from 'src/views/projects/reports/chart/ProjectProfit'
import TaskStatus from 'src/views/projects/reports/chart/TaskStatus'
import PendingTaskPriority from 'src/views/projects/reports/chart/PendingTaskPriority'
import ResourceUtilizationIndex from 'src/views/projects/reports/chart/ResourceUtlizationIndex'
import RevenueIndex from 'src/views/projects/reports/chart/RevenueIndex'
import TaskEfficiency from 'src/views/projects/reports/chart/TaskEfficiency'
import TaskProgressPie from 'src/views/projects/reports/chart/TaskProgress'
import TaskProgressArea from 'src/views/projects/reports/chart/TaskProgressArea'
import TaskCompletionRate from './chart/TaskCompletionRate'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjectsReport } from 'src/store/apps/projects'
import { unwrapResult } from '@reduxjs/toolkit'
import FallbackSpinner from 'src/@core/components/spinner'
import toast from 'react-hot-toast'

const ProjectsStats = ({ id }) => {
  const dispatch = useDispatch()
  const [loader, setLoader] = useState(false)
  console.log(id)
  const { projectReport } = useSelector(state => state.projects)

  useEffect(() => {
    setLoader(true)
    if (id) {
      dispatch(fetchProjectsReport(id))
        .then(unwrapResult)
        .then(() => {
          setLoader(false)
        })
        .catch(error => {
          setLoader(false)
          toast.error(error.message)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <>
      {loader ? (
        <FallbackSpinner />
      ) : (
        <ApexChartWrapper>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <ProjectProfit details={projectReport.projectProfitDto || {}} />
              <br />
              <TaskCompletionRate details={projectReport.taskCompletionRateDto || {}} />
            </Grid>
            <Grid item xs={12} md={3} lg={3} sm={6}>
              <BurnedCostPie details={projectReport.burnedCostReportDto || {}} />
            </Grid>
            <Grid item xs={12} md={3} lg={3} sm={6}>
              <TaskProgressPie details={projectReport.taskProgressDto || {}} />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <TaskStatus details={projectReport.taskStatusReportDto || []} />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
              <TaskEfficiency details={projectReport.taskEfficiencyIndexDto || {}} />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
              <ResourceUtilizationIndex details={projectReport.resourceUtilizationRateDto || {}} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <RevenueIndex details={projectReport || {}} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <PendingTaskPriority details={projectReport.pendingTasksByPriorityDtos || []} />
            </Grid>
            <Grid item xs={12} sm={6} md={8} lg={8}>
              <TaskProgressArea details={projectReport || {}} />
            </Grid>
          </Grid>
        </ApexChartWrapper>
      )}
    </>
  )
}

export default memo(ProjectsStats)
