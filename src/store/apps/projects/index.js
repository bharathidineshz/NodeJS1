import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { endpointURL, endpoints } from 'src/store/endpoints/endpoints'
import { fetchData } from '../user'
import instance from 'src/store/endpoints/interceptor'
import { parseMarker } from '@fullcalendar/core/internal'
import toast from 'react-hot-toast'
import { formatLocalDate } from 'src/helpers/dateFormats'
import { CATEGORIES, FEEDBACKS, PROJECT_MEMBERS, TASk_LIST } from 'src/helpers/constants'

// ** Fetch Reports
export const fetchClients = createAsyncThunk('projects/fetchClients', async params => {
  const response = await instance.get(endpoints.getAllClient)

  return response.data
})

//** fetch projects */
export const fetchProjects = createAsyncThunk('projects/fetchProjects', async params => {
  const response = await instance.get(endpoints.getProjects)

  return response.data
})

//** fetch users */
export const fetchUsers = createAsyncThunk('projects/fetchUsers', async params => {
  const response = await instance.get(endpoints.allUsers)

  return response.data
})

//** fetch users */
export const fetchProjectsByUser = createAsyncThunk(
  'projects/fetchProjectsByUser',
  async params => {
    const response = await instance.get(endpoints.projectsByUser)

    return response.data
  }
)

export const fetchProjectAssignees = createAsyncThunk(
  'projects/fetchProjectAssignees',
  async params => {
    const response = await instance.get(endpoints.projectAssignees)

    return response.data
  }
)

export const postTask = createAsyncThunk('projects/postTask', async params => {
  const response = await instance.post(endpoints.postTask, params, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  return response.data
})

//** fetch categories */
export const fetchCategories = createAsyncThunk('projects/fetchCategories', async params => {
  const response = await instance.get(endpoints.taskCategories)

  return response.data
})

//** fetch tasks */
export const fetchTasks = createAsyncThunk('projects/fetchTasks', async params => {
  const response = await instance.get(endpoints.getTaskList(params))

  return response.data
})

export const fetchMileStones = createAsyncThunk('projects/fetchMileStones', async params => {
  const response = await instance.get(endpoints.mileStones)

  return response.data
})

export const fetchRequiredSkills = createAsyncThunk(
  'projects/fetchRequiredSkills',
  async params => {
    const response = await instance.get(endpoints.skills)

    return response.data
  }
)

//** fetch tasks */
export const fetchProjectsReport = createAsyncThunk('projects/fetchProjectsReport', async id => {
  const response = await instance.get(endpoints.getProjectReportsDetails(id))

  return response.data
})

export const fetchProjectMembers = createAsyncThunk(
  'projects/fetchProjectMembers',
  async params => {
    const response = await instance.get(endpoints.projectMembers(params))

    return response.data
  }
)

//POST
export const postProject = createAsyncThunk('projects/postProject', async params => {
  const response = await instance.post(endpoints.projects, params)

  return response
})

export const postCategory = createAsyncThunk('projects/postCategory', async params => {
  const response = await instance.post(endpoints.createCategory, params)

  return response.data
})

export const postMileStone = createAsyncThunk('projects/postMileStone', async params => {
  const response = await instance.post(endpoints.mileStones, params)

  return response
})

export const postAssignee = createAsyncThunk('projects/postAssignee', async params => {
  const response = await instance.post(endpoints.projectAssignees, params)

  return response
})

//PUT
export const putProject = createAsyncThunk('projects/putProject', async params => {
  try {
    const response = await instance.put(endpoints.projects, params)

    return response.data
  } catch (error) {
    toast.error(error.message, { duration: 3000, position: 'top-right' })

    return error
  }
})

export const putTask = createAsyncThunk('projects/putTask', async params => {
  try {
    const response = await instance.put(endpoints.putTask, params, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return response.data
  } catch (error) {
    toast.error(error.message, { duration: 3000, position: 'top-right' })

    return error
  }
})

//POST
export const deleteProject = createAsyncThunk('projects/deleteProject', async params => {
  const response = await instance.post(endpoints.deleteProject(params))

  return response.data
})

export const putCategory = createAsyncThunk('projects/putCategory', async params => {
  try {
    const response = await instance.put(endpoints.putTaskCategory, params.request)

    if (response.data === 'Cannot remove tasks with existing timesheet Entry') {
      toast.error(response.data, { duration: 3000, position: 'top-right' })
    } else {
      toast.success('Task Category Updated', { duration: 3000, position: 'top-right' })
    }
    params.afterSubmit()

    return response.data
  } catch (error) {
    toast.error(error.message, { duration: 3000, position: 'top-right' })
    params.afterSubmit()

    return error
  }
})

export const putProjectMap = createAsyncThunk('projects/putProjectMap', async params => {
  const response = await instance.put(endpoints.updateProjectMap, params)

  return response.data
})

export const getProjectDetails = createAsyncThunk('projects/getProjectDetails', async params => {
  const response = await instance.get(endpoints.getProjectDetails(params))

  return response.data
})

export const deleteTask = createAsyncThunk('projects/deleteTask', async params => {
  const response = await instance.delete(endpoints.deleteTask(params))

  return response.data
})

export const fetchDepartment = createAsyncThunk('projects/fetchDepartment', async params => {
  const response = await instance.get(endpoints.getDepartment)

  return response.data
})

export const appProjects = createSlice({
  name: 'projects',
  initialState: {
    allClients: [],
    users: [],
    allProjects: [],
    client: {},
    allTasks: [],
    editProject: {},
    projectDetails: {},
    selectedProject: {},
    projectReport: [],
    project: {
      uniqueId: '',
      projectType: 2,
      projectName: '',
      plannedBudget: '',
      plannedHours: '',
      isBillable: true,
      allowOpenTasks: false
    },
    category: [],
    tasks: [
      {
        index: 0,
        name: '',
        category: '',
        hours: ''
      }
    ],
    assignees: [],

    //list
    departments: [],
    taskLists: [],
    projectMembers: [],
    editTask: {},
    selectedCategory: '',
    categories: [],
    mileStones: [],
    feedbacks: FEEDBACKS,
    requiredSkills: [],
    projectAssignees: [],
    userProjects: [],
    //boolean
    isEmpty: false
  },
  reducers: {
    setClient: (state, action) => {
      state.client = action.payload?.result
    },
    setProject: (state, action) => {
      state.project = action.payload?.result
    },
    setProjectsDetails: (state, action) => {
      state.projectDetails = action.payload?.result
    },
    setCategory: (state, action) => {
      state.category = action.payload?.result
    },
    setTasks: (state, { payload }) => {
      state.tasks = payload
    },
    setAssignees: (state, action) => {
      state.assignees = action.payload
    },
    setEditProject: (state, action) => {
      state.editProject = action.payload?.result
    },
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload?.result
    },
    setEditTask: (state, { payload }) => {
      state.editTask =
        Object.keys(payload).length > 0
          ? { ...payload, dueDate: new Date(payload.dueDate) }
          : payload
    },
    setSelectedCategory: (state, { payload }) => {
      state.selectedCategory = payload
    },
    setCategories: (state, { payload }) => {
      state.categories = payload
    },
    setTaskLists: (state, { payload }) => {
      state.taskLists = payload
    },
    setProjectMembers: (state, { payload }) => {
      state.projectMembers = payload
    },
    setMileStones: (state, { payload }) => {
      state.mileStones = payload
    },
    setFeedbacks: (state, { payload }) => {
      state.feedbacks = payload
    },
    //boolean
    setEmpty: (state, { payload }) => {
      state.isEmpty = payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchClients.fulfilled, (state, action) => {
      state.allClients = action.payload?.result ?? []
    })
    builder.addCase(fetchDepartment.fulfilled, (state, action) => {
      state.departments = action.payload?.result ?? []
    })
    // builder.addCase(fetchProjectsReport.fulfilled, (state, action) => {
    //   const userMap = {}
    //   state.users.forEach(user => {
    //     userMap[user.email] = user.userName
    //   })

    //   const tasksWithUsernames = action.payload?.result.tasks.map((task, i) => ({
    //     ...task,
    //     id: i,
    //     userName: userMap[task.userId]
    //   }))
    //   state.projectReport = tasksWithUsernames
    // })
    builder.addCase(postProject.fulfilled, (state, action) => {
      state.project.uniqueId = action.payload.data.result.id
    })
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      action.payload?.result?.forEach(project => {
        const client = state.allClients.find(c => c.id === project.clientId)
        project.clientName = client ? client.companyName : ''
      })
      state.allProjects = action.payload?.result
    })
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      const users = action.payload?.result?.map(user => ({
        ...user,
        userName: `${user.firstName} ${user.lastName}`
      }))
      state.users = users
    })
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      const categories = action.payload?.result?.filter(
        o => o.projectId === localStorage.getItem('projectId')
      )
      state.categories = categories || []
    })
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.taskLists = action.payload?.result?.tasksByCategory || []
    })
    builder.addCase(getProjectDetails.fulfilled, (state, action) => {
      state.projectDetails = action.payload.result
    })
    builder.addCase(fetchMileStones.fulfilled, (state, action) => {
      var mileStones = action.payload.result.filter(o => o.projectId === state.selectedProject?.id)
      mileStones = mileStones.sort((start, end) => {
        return new Date(start.startDate) - new Date(end.endDate)
      })
      state.mileStones = mileStones || []
    })
    builder.addCase(fetchRequiredSkills.fulfilled, (state, action) => {
      state.requiredSkills = action.payload?.result || []
    })
    builder.addCase(fetchProjectMembers.fulfilled, (state, action) => {
      state.projectMembers = action.payload?.result?.members || []
    })
    builder.addCase(fetchProjectsByUser.fulfilled, (state, action) => {
      state.userProjects = action.payload?.result || []
    })
    builder.addCase(fetchProjectAssignees.fulfilled, (state, action) => {
      const assignees = action.payload.result?.filter(
        o => o.projectId == localStorage.getItem('projectId')
      )
      const tempUsers = []
      assignees.forEach(user => {
        const _user = state.users?.find(o => o.id === user.userId)
        tempUsers.push({
          email: _user?.email,
          userName: `${_user?.firstName} ${_user?.lastName}`,
          ...user
        })
      })
      state.assignees = tempUsers
    })
    builder.addCase(fetchProjectsReport.fulfilled, (state, action) => {
      state.projectReport = action.payload?.result
    })
  }
})

export const {
  setClient,
  setCategory,
  setSelectedProject,
  setTasks,
  setEditProject,
  setProjectsDetails,
  setAssignees,
  setProject,
  setFeedbacks,
  setMileStones,
  setEditTask,
  setSelectedCategory,
  setCategories,
  setTaskLists,
  setEmpty,
  setProjectMembers
} = appProjects.actions

export default appProjects.reducer
