import { Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EmptyTask from 'src/views/projects/details/task-category/tasks/EmptyTask'
import TaskLists from 'src/views/projects/details/task-category/tasks/TaskLists'

const TaskCategory = () => {
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)
  const [isEmpty, setIsEmpty] = useState(false)

  useEffect(() => {
    store.categories.length > 0 ? setIsEmpty(false) : setIsEmpty(true)
  }, [store.categories, store.isEmpty])

  return <Grid>{isEmpty ? <EmptyTask /> : <TaskLists />}</Grid>
}

export default TaskCategory
