import { Grid } from '@mui/material'
import React, { useEffect } from 'react'
import ApexDonutChart from 'src/views/projects/reports/chart/ApexDonutChart'
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

const ProjectsStats = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <ProjectProfit />
          <br />
          <TaskCompletionRate />
        </Grid>
        <Grid item xs={12} md={3} lg={3} sm={6}>
          <ApexDonutChart />
        </Grid>
        <Grid item xs={12} md={3} lg={3} sm={6}>
          <TaskProgressPie />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <TaskStatus />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4}>
          <TaskEfficiency />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4}>
          <ResourceUtilizationIndex />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <RevenueIndex />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <PendingTaskPriority />
        </Grid>
        <Grid item xs={12} sm={6} md={8} lg={8}>
          <TaskProgressArea />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default ProjectsStats
