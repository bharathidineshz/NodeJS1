import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { endpointURL, endpoints } from 'src/store/endpoints/endpoints'
import instance from 'src/store/endpoints/interceptor'

// export const fetchData = createAsyncThunk()

export const fetchClients = createAsyncThunk('appClient/fetchClients', async params => {
  const response = await instance.get(endpoints.getAllClient)

  return response.data
})

export const addClients = createAsyncThunk(
  'appClient/addClients',
  async (data, { getState, dispatch }) => {
    console.log(data)

    const response = await instance.post(endpoints.addClient, data)
    dispatch(fetchData(getState().client.params))

    return response.data
  }
)

export const deleteClient = createAsyncThunk(
  'appClient/deleteClient',
  async (id, { getState, dispatch }) => {
    console.log(id)

    const response = await instance.delete(endpoints.deletClient, {
      data: id,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    dispatch(fetchData(getState().client.params))

    return response.data
  }
)

export const appClientSlice = createSlice({
  name: 'appClient',
  initialState: {
    clients: [],
    allData: []
  },
  reducers: {
    setClients: (state, { payload }) => {
      state.clients = payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchClients.fulfilled, (state, action) => {
      state.clients = action.payload
    })
  }
})

export const { setClients } = appClientSlice.actions

export default appClientSlice.reducer
