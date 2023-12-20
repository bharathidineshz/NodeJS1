import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
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

// ** Post Data (POST)
export const postData = createAsyncThunk('appTimesheet/postData', async (postData, { store, dispatch }) => {

  try {
    const response = await instance.post(endpoints.postTimesheetList, postData)
    dispatch(fetchData())
    toast.success("Time sheet entry created succesfully")
  } catch (error) {
    toast.error(error.message)

  }

  return response.data
})

// ** Update Data (PUT)
export const UpdateData = createAsyncThunk('appTimesheet/UpdateData', async (UpdateData, { store, dispatch }) => {
  try {
    const response = await instance.put(endpoints.putTimesheetList, UpdateData)
    dispatch(fetchData())
    toast.success("Time sheet Updated succesfully")
  } catch (error) {
    toast.error(error.message)

  }

  return response.data
})

export const DeleteData = createAsyncThunk('appTimesheet/deleteTimesheet', async (DeleteData, { store, dispatch }) => {
  try {
    const response = await instance.delete(endpoints.deleteTimesheetList(DeleteData))
    dispatch(fetchData())
    toast.success("Time sheet Deleted succesfully")
  } catch (error) {
    toast.error(error.message)

  }

  return response.data
})

export const appTimeSheetSlice = createSlice({
  name: 'appTimesheet',
  initialState: {
    data: [],
    taskData: [],
    projectData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchData.fulfilled, (state, action) => {
        state.data = action.payload
      })
      .addCase(fetchTaskData.fulfilled, (state, action) => {
        state.taskData = action.payload
      })
      .addCase(fetchProjectData.fulfilled, (state, action) => {
        state.projectData = action.payload
      })
  }
})

export default appTimeSheetSlice.reducer
