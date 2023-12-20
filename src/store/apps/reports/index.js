
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { endpointURL, endpoints } from 'src/store/endpoints/endpoints'
import instance from 'src/store/endpoints/interceptor'

// ** Fetch Users
export const fetchEmployeeReports = createAsyncThunk('reportSlice/fetchEmployeeReports', async params => {
  if (params) {
    const response = await instance.get(endpoints.getAllEmployeeReports(params[0], params[1]))

    return response.data;
  }

  else return []
})

export const fetchUserData = createAsyncThunk('reportSlice/fetchUserData', async params => {

  const response = await instance.get(endpoints.allUsers)

  return response.data
})

export const fetchClient = createAsyncThunk('reportSlice/fetchClient', async params => {

  const response = await instance.get(endpoints.getAllClient);


  return response.data
})

export const fetchProject = createAsyncThunk('reportSlice/fetchProject', async params => {

  const response = await instance.get(endpoints.getAllProjects)

  return response.data
})

export const fetchEmployee = createAsyncThunk('reportSlice/fetchEmployee', async params => {

  const response = await instance.get(endpoints.getEmployeeReports(params))

  return response.data
})

export const fetchProjectReports = createAsyncThunk('reportSlice/fetchProjectReports', async params => {

  if (params) {
    const response = await instance.get(endpoints.getAllProjectsReport(params[0], params[1]))

    return response.data;
  }

  else return []
})

export const fetchClientReports = createAsyncThunk('reportSlice/fetchClientReports', async params => {

  if (params) {
    const response = await instance.get(endpoints.getAllClientReports(params[0], params[1]))

    return response.data;
  }

  else return []
})

const initialState = {
  //NUMBES
  billableHours: 0,
  nonBillableHours: 0,

  //STRINGS
  groupByValue: "User",
  selectedClient: "",
  selectedUser: "",
  selectedProject: "",

  //LISTS
  users: [],
  projects: [],
  clients: [],
  userReports: [],
  projectReports: [],
  clientReports: [],
  dateRanges: [],

  // OBJECTS
  period: {},
  selectedRow: {},

  //GET STATES
  userResponse: [],
  allUsers: [],
  clientResponse: [],
  projectResponse: [],
  userReports: [],
  projectReports: [],
  clientResponse: [],
};

const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    saveBillables: ({ billableHours, nonBillableHours }, { payload }) => {
      billableHours = payload.BillableCost;
      nonBillableHours = payload.nonBillableCost;
    },
    setGroupByValue: (state, action) => {
      state.groupByValue = action.payload;
    },
    setReportUsers: (state, { payload }) => {
      state.users = payload;
    },
    setReportProjects: (state, { payload }) => {
      state.projects = payload;
    },
    setReportClients: (state, { payload }) => {
      state.clients = payload;
    },
    setPeriodRange: (state, { payload }) => {
      state.period.startDate = payload?.startDate && payload.startDate;
      state.period.endDate = payload?.endDate && payload.endDate;
    },
    setSelectedRowData: (state, { payload }) => {
      state.selectedRow = payload;
    },
    setSelectedClient: (state, { payload }) => {
      state.selectedClient = payload;
    },
    setSelectedUser: (state, { payload }) => {
      state.selectedUser = payload;
    },
    setSelectedProject: (state, { payload }) => {
      state.selectedProject = payload;
    },
    setDateRanges: (state, { payload }) => {
      state.dateRanges = payload;
    },

    // REPORTS
    setUserReports: (state, { payload }) => {
      state.userReports = payload;
    },
    setClientReports: (state, { payload }) => {
      state.clientReports = payload;
    },
    setProjectReports: (state, { payload }) => {
      state.projectReports = payload;
    },

  },
  extraReducers: builder => {
    builder.addCase(fetchEmployeeReports.fulfilled, (state, action) => {
      var users = action.payload;
      users.forEach((user, index) => {
        const _user = state.allUsers.find((u) => (u?.id === user?.employeeId) || (u?.email === user?.employeeMailId));
        if (_user != null) {
          const burns = Math.round(user.totalBurnedHours * 100) / 100;
          user.totalBurnedHours = burns.toFixed(2);
          user.id = index,
            user.fullName = `${_user?.firstName} ${_user?.lastName}`
        }
      });
      state.users = users
    })
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.allUsers = action.payload
    })
    builder.addCase(fetchClientReports.fulfilled, (state, action) => {
      var clients = action.payload;
      clients.forEach((client, index) => {
        const burns = Math.round(client.totalBurnedHours * 100) / 100;
        client.totalBurnedHours = burns.toFixed(2);
        client.id = index
      });
      state.clients = clients
    })
    builder.addCase(fetchProjectReports.fulfilled, (state, action) => {
      var projects = action.payload;
      projects.forEach((proj, index) => {
        const burns = Math.round(proj.totalBurnedHours * 100) / 100;
        proj.totalBurnedHours = burns.toFixed(2);
        proj.id = index
      });
      state.projects = projects
    })
  }
});


// export actions
export const {
  saveBillables,
  setGroupByValue,
  setReportUsers,
  setReportProjects,
  setReportClients,
  setPeriodRange,
  setSelectedRowData,
  setSelectedClient,
  setSelectedUser,
  setSelectedProject,
  setUserReports,
  setClientReports,
  setProjectReports,
  setDateRanges
} = reportSlice.actions;

// export reducer it-self
export default reportSlice.reducer;
