import { Grid, Typography } from '@mui/material'
import { unwrapResult } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories, fetchTasks } from 'src/store/apps/projects'
import EmptyTask from 'src/views/projects/details/task-category/tasks/EmptyTask'
import TaskLists from 'src/views/projects/details/task-category/tasks/TaskLists'

const TaskCategory = () => {
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)
  const [isEmpty, setIsEmpty] = useState(false)

  useEffect(() => {
    dispatch(fetchTasks(localStorage.getItem("projectId"))).then(unwrapResult).then((res)=>{
      res?.tasksByCategory?.length > 0  ? setIsEmpty(false) : setIsEmpty(true)
    })
  }, [dispatch])

  return <Grid>{isEmpty ? <EmptyTask /> : <TaskLists />}</Grid>
}

export default TaskCategory
