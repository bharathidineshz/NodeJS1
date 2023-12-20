import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { endpointURL, endpoints } from 'src/store/endpoints/endpoints'
import instance from 'src/store/endpoints/interceptor'

import toast from 'react-hot-toast'

// ** Fetch Hoildays
export const fetchHolidays = createAsyncThunk('/account-settings/holidaymanagement/getHoliday', async params => {
  const response = await instance.get(endpoints.getHolidayRequests, {
    params
  })

  return response.data
})

// ** Add Holiday
export const addHoliday = createAsyncThunk('/account-settings/holidaymanagement/addHoliday', async (event, { dispatch }) => {
  try {
    const response = await instance.post(endpoints.addHolidayRequests, event)
    await dispatch(fetchHolidays())
    toast.success("Holiday Entry created succesfully")

    return response.data.event

  } catch (error) {
    toast.error(error.message)

    return error.message
  }
})

// ** Update Holiday
export const updateHoliday = createAsyncThunk('/account-settings/holidaymanagement/updateHoliday', async (event, { dispatch }) => {
  try {

    const response = await instance.put(endpoints.updateHolidayRequests, event)

    await dispatch(fetchHolidays())
    toast.success("Holiday Entry Updated succesfully")

    return response.data.event

  } catch (error) {
    toast.error(error.message)

    return error.message
  }
})

// ** Delete Holiday
export const deleteHoliday = createAsyncThunk('/account-settings/holidaymanagement/deleteHoliday', async (event, { dispatch }) => {
  try {
    const response = await instance.delete(endpoints.deleteHolidayRequests, { data: event })
    await dispatch(fetchHolidays())
    toast.success("Holiday Entry Deleted succesfully")

    return response.data.event

  } catch (error) {
    toast.error(error.message)

    return error.message
  }
})

export const appAccountSettingsSlice = createSlice({
  name: 'appAccountSettings',
  initialState: {
    holidays: [],
    taskData: [],
    projectData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchHolidays.fulfilled, (state, action) => {

        action.payload && (state.holidays = action.payload)
      })

    // .addCase(fetchTaskData.fulfilled, (state, action) => {
    //   state.taskData = action.payload
    // })

  }
})

export default appAccountSettingsSlice.reducer