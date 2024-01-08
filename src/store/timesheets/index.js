import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { endpointURL, endpoints } from 'src/store/endpoints/endpoints'
import instance from 'src/store/endpoints/interceptor'

// ** Fetch Timesheets
export const fetchData = createAsyncThunk('appTimesheet/getTimeSheet', async params => {
  const response = await instance.get(endpoints.getTimesheetList)

  return response.data
})

// ** Fetch Task
export const fetchTaskData = createAsyncThunk('appTimesheet/getTaskData', async params => {
  const response = await instance.get(endpoints.getTask)

  return response.data
})

// ** Fetch Project List
export const fetchProjectData = createAsyncThunk('appTimesheet/getProjectData', async params => {
  const response = await instance.get(endpoints.getAssignedProjects)

  return response.data
})

export const fetchAssignedTask = createAsyncThunk(
  'appTimesheet/getAssignedTaskData',
  async params => {
    const response = await instance.get(endpoints.getTaskbyProject(params))

    return response.data
  }
)

export const fetchAssignedProject = createAsyncThunk(
  'appTimesheet/getAssignedProjectData',
  async params => {
    const response = await instance.get(endpoints.getAssignedProject)

    return response.data
  }
)

// ** Post Data (POST)
export const postData = createAsyncThunk(
  'appTimesheet/postData',
  async (postData, { store, dispatch }) => {
    try {
      const response = await instance.post(endpoints.postTimesheetList, postData)

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

// ** Update Data (PUT)
export const UpdateData = createAsyncThunk(
  'appTimesheet/UpdateData',
  async (UpdateData, { store, dispatch }) => {
    try {
      const response = await instance.put(endpoints.putTimesheetList, UpdateData)

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const DeleteData = createAsyncThunk(
  'appTimesheet/deleteTimesheet',
  async (DeleteData, { store, dispatch }) => {
    try {
      const response = await instance.delete(endpoints.deleteTimesheetList(DeleteData))

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const appTimeSheetSlice = createSlice({
  name: 'appTimesheet',
  initialState: {
    data: [],
    taskData: [],
    projectData: []
  },
  reducers: {
    setTimeSheets: (state, { payload }) => {
      state.data = payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchData.fulfilled, (state, action) => {
        let sortedArray = action.payload.result?.sort((a, b) => {
          return new Date(b.timeSheetDate).getTime() - new Date(a.timeSheetDate).getTime()
        })
        state.data = sortedArray ?? []
      })
      .addCase(fetchAssignedTask.fulfilled, (state, action) => {
        state.taskData = action.payload.result?.tasksByCategory
      })
      .addCase(fetchAssignedProject.fulfilled, (state, action) => {
        state.projectData = action.payload.result
      })
  }
})

export const { setTimeSheets } = appTimeSheetSlice.actions
export default appTimeSheetSlice.reducer
