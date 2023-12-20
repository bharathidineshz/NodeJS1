// Import necessary dependencies from Redux Toolkit and Axios
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { endpointURL, endpoints } from '../endpoints/endpoints';

// Create a Redux-thunk action for signup
export const signUpUser = createAsyncThunk('auth/signUpUser', async () => {
    const userData = {
        first_name:'Naveen',
        last_name:'Mounasamy',
        email:'naveenkumar.mounasamy@athen.club',
        password:'123qwe'
    };
  const response = await axios.post(endpointURL(endpoints.tenant), userData);

return response.data;
});

// Create a slice for authentication
export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    error: null,
    isLoading: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.error = null;
      state.isLoading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setLoading: (state) => {
      state.isLoading = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      });
  },
});

export const { setUser, setError, setLoading } = authSlice.actions;

export default authSlice.reducer;
