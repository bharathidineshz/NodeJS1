import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import { endpointURL, endpoints } from 'src/store/endpoints/endpoints'
import instance from 'src/store/endpoints/interceptor'

//fetch
export const fetchMyLeaves = createAsyncThunk('fetchMyLeaves/LeaveRequest', async params => {
  const response = await instance.get(endpoints.myLeaves)

  return response.data
})

export const fetchPolicies = createAsyncThunk('fetchPolicy/LeavePolicy', async params => {
  const response = await instance.get(endpoints.getLeavePolicy)

  return response.data
})

export const fetchStatus = createAsyncThunk('fetchStatus/Status', async params => {
  const response = await instance.get(endpoints.getStatus)

  return response.data
})

export const fetchRequestTypes = createAsyncThunk(
  'fetchRequestTypes/RequestTypes',
  async params => {
    const response = await instance.get(endpoints.requestTypes)

    return response.data
  }
)

export const fetchUsers = createAsyncThunk('fetchUsers/users', async params => {
  const response = await instance.get(endpoints.allUsers)

  return response.data
})

export const fetchApprovals = createAsyncThunk('fetchApprovals/Approvals', async params => {
  const response = await instance.get(endpoints.getApprovals)

  return response.data
})

export const fetchUserReports = createAsyncThunk(
  'fetchUserReports/Reports',
  async ({ userId, fromDate, toDate }) => {
    const response = await instance.get(endpoints.getUserReports(userId, fromDate, toDate))

    return response.data
  }
)

export const fetchDashboard = createAsyncThunk('fetchDashboard/Reports', async params => {
  const response = await instance.get(endpoints.getDashboard(params))

  return response.data
})

//post
export const postLeaveRequest = createAsyncThunk('postLeaveRequest/LeaveRequest', async params => {
  const response = await instance.post(endpoints.myLeaves, params)

  return response
})

export const postPolicy = createAsyncThunk('postPolicy/LeavePolicy', async params => {
  const response = await instance.post(endpoints.createLeavePolicy, params)

  return response
})

//put
export const putRequest = createAsyncThunk('putRequest/LeaveRequest', async params => {
  const response = await instance.put(endpoints.myLeaves, params)

  return response
})

export const putPolicy = createAsyncThunk('putPolicy/LeavePolicy', async params => {
  const response = await instance.put(endpoints.leavePolicy, params)

  return response
})

//delete
export const deletePolicy = createAsyncThunk('deletePolicy/LeavePolicy', async params => {
  const response = await instance.delete(endpoints.deleteLeavePolicy(params))

  return response.data
})

export const LeaveManagement = createSlice({
  name: 'leaveManagement',
  initialState: {
    myLeaves: [],
    requestTypes: [],
    policies: [],
    statuses: [],
    users: [],
    approvals: [],
    reports: [],
    dashboards: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchMyLeaves.fulfilled, (state, action) => {
      const requests = [...action.payload]

      requests.forEach((req, i) => {
        const policy = state.policies.find(o => o.id === req.requestTypeId)
        req.requestType = policy != null ? policy?.typeOfLeave : ''
      })

      state.myLeaves = requests
    })
    builder.addCase(fetchRequestTypes.fulfilled, (state, action) => {
      state.requestTypes = action.payload
    })
    builder.addCase(fetchPolicies.fulfilled, (state, action) => {
      state.policies = action.payload
    })
    builder.addCase(fetchStatus.fulfilled, (state, action) => {
      state.statuses = action.payload
    })
    builder.addCase(fetchApprovals.fulfilled, (state, action) => {
      const approvals = [...action.payload]
      approvals.forEach(approval => {
        const requestType = state.requestTypes.find(o => o.id === approval.leaveRequestId)
        approval.user = state.users?.find(o => o.id == requestType.submittedUserId)
        approval.fromDate = requestType.fromDate
        approval.toDate = requestType.toDate
        approval.requestReason = requestType.requestReason
        if (approval.user)
          approval.user.fullName = `${approval.user.firstName} ${approval.user.lastName}`
      })
      state.approvals = approvals
    })
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      const users = [...action.payload]
      users.map(u => {
        u.fullName = `${u.firstName} ${u.lastName}`
      })
      state.users = users
    })
    builder.addCase(fetchUserReports.fulfilled, (state, action) => {
      const reports = { ...action.payload }
      reports.totalLeaves?.map((report, i) => {
        report.id = i
      })
      state.reports = reports
    })
    builder.addCase(fetchDashboard.fulfilled, (state, action) => {
      const dashboards = { ...action.payload }
      dashboards.totalLeaves?.map((report, i) => {
        report.id = i
      })
      state.dashboards = dashboards
    })
  }
})

export const {} = LeaveManagement.actions

export default LeaveManagement.reducer
