import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { endpointURL, endpoints } from 'src/store/endpoints/endpoints'
import instance from 'src/store/endpoints/interceptor'

// export const fetchData = createAsyncThunk()

export const fetchClients = createAsyncThunk('appClient/fetchClients', async params => {
  const response = await instance.get(endpoints.getAllClient)

  return response.data.result
})

export const fetchClientById = createAsyncThunk('appClient/fetchClientById', async params => {
  const response = await instance.get(endpoints.clientById(params))

  return response.data
})

export const addClients = createAsyncThunk(
  'appClient/addClients',
  async (data, { getState, dispatch }) => {
    const response = await instance.post(endpoints.addClient, data)

    return response
  }
)

export const updateClient = createAsyncThunk('appClient/updateClient', async data => {
  const response = await instance.put(endpoints.updateClient, data)

  return response
})

export const deleteClient = createAsyncThunk(
  'appClient/deleteClient',
  async (id, { getState, dispatch }) => {
    const response = await instance.delete(endpoints.deleteClient(id))

    return response
  }
)

export const appClientSlice = createSlice({
  name: 'appClient',
  initialState: {
    clients: [],
    allData: [],
    client: {}
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
    builder.addCase(fetchClientById.fulfilled, (state, action) => {
      state.client = action.payload
    })
  }
})

export const { setClients } = appClientSlice.actions

export default appClientSlice.reducer