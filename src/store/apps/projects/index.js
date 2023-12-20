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
  const response = await instance.get(endpoints.getAllProjects)

  return response.data
})

//** fetch users */
export const fetchUsers = createAsyncThunk('projects/fetchUsers', async params => {
  const response = await instance.get(endpoints.allUsers)

  return response.data
})

//** post assignees */
export const postUser = createAsyncThunk('projects/postUser', async params => {
  const response = await instance.post(endpoints.assignUsers, params)

  return response.data
})

//** post assignees */
export const postCategory = createAsyncThunk('projects/postCategory', async params => {
  const response = await instance.post(endpoints.postTaskCategory, params)

  return response.data
})

export const postTask = createAsyncThunk('projects/postTask', async params => {
  const response = await instance.post(endpoints.postTask, params)

  return response.data
})

//** fetch categories */
export const fetchCategories = createAsyncThunk('projects/fetchCategories', async params => {
  const response = await instance.get(endpoints.getTaskCategoriesbyProjectID(params))

  return response.data
})

//** fetch tasks */
export const fetchTasks = createAsyncThunk('projects/fetchTasks', async params => {
  const response = await instance.get(endpoints.getTask)

  return response.data
})

//** fetch tasks */
export const fetchProjectsReport = createAsyncThunk('projects/fetchProjectsReport', async params => {
  const response = await instance.get(endpoints.getGetProjectReports(params))

  return response.data
})

//POST
export const postProject = createAsyncThunk('projects/postProject', async params => {
  const response = await instance.post(endpoints.createProject, params)

  return response.data
})

//PUT
export const putProject = createAsyncThunk('projects/putProject', async params => {
  try {

    const response = await instance.put(endpoints.putProjects, params.request)
    toast.success('Project Updated', { duration: 3000, position: 'top-right' })
    params.afterSubmit()

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

    if (response.data === "Cannot remove tasks with existing timesheet Entry") {
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

export const putTask = createAsyncThunk('projects/putTask', async params => {
  try {

    const response = await instance.put(endpoints.putTask, params.request)
    toast.success('Task Updated', { duration: 3000, position: 'top-right' })
    params.afterSubmit()

    return response.data
  } catch (error) {
    toast.error(error.message, { duration: 3000, position: 'top-right' })

    // params.afterSubmit()
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

export const appProjects = createSlice({
  name: 'projects',
  initialState: {
    allClients: [],
    users: [],
    allProjects: [],
    client: {},
    allCategories: [],
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
    taskLists: TASk_LIST,
    projectMembers: PROJECT_MEMBERS,
    editTask: {},
    selectedCategory: '',
    categories: CATEGORIES,
    mileStones: [],
    feedbacks: FEEDBACKS,

    //boolean
    isEmpty: false
  },
  reducers: {
    setClient: (state, action) => {
      state.client = action.payload
    },
    setProject: (state, action) => {
      state.project = action.payload
    },
    setProjectsDetails: (state, action) => {
      state.projectDetails = action.payload
    },
    setCategory: (state, action) => {
      state.category = action.payload
    },
    setTasks: (state, action) => {
      state.tasks = action.payload
    },
    setAssignees: (state, action) => {
      state.assignees = action.payload
    },
    setEditProject: (state, action) => {
      state.editProject = action.payload
    },
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload
    },
    setTaskLists: (state, { payload }) => {
      state.taskLists = payload;
    },
    setEditTask: (state, { payload }) => {
      state.editTask = Object.keys(payload).length > 0 ? { ...payload, dueDate: new Date(payload.dueDate) } : payload;
    },
    setSelectedCategory: (state, { payload }) => {
      state.selectedCategory = payload;
    },
    setCategories: (state, { payload }) => {
      state.categories = payload;
    },
    setProjectMembers: (state, { payload }) => {
      state.projectMembers = payload;
    },
    setMileStones: (state, { payload }) => {
      state.mileStones = payload;
    },
    setFeedbacks: (state, { payload }) => {
      state.feedbacks = payload;
    },

    //boolean
    setEmpty: (state, { payload }) => {
      state.isEmpty = payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchClients.fulfilled, (state, action) => {
      state.allClients = action.payload
    })
    builder.addCase(fetchProjectsReport.fulfilled, (state, action) => {
      const userMap = {};
      state.users.forEach((user) => {
        userMap[user.email] = user.userName;
      });

      const tasksWithUsernames = action.payload.tasks.map((task, i) => ({
        ...task,
        id: i,
        userName: userMap[task.userId],
      }));
      state.projectReport = tasksWithUsernames
    })
    builder.addCase(postProject.fulfilled, (state, action) => {
      const { data } = action.payload
      if (action.payload.isSuccess) state.project.uniqueId = data
    })
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      action.payload?.forEach(project => {
        const client = state.allClients.find(c => c.id === project.clientId)
        project.assignee.flat().forEach(u => {
          const user = state.users.find(c => c.id === u.userId)
          u.userName = user ? `${user.firstName} ${user.lastName}` : ''
        })
        project.clientName = client ? client.name : ''
      })
      state.allProjects = action.payload
    })
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      const users = action.payload.map(user => ({
        ...user,
        userName: `${user.firstName} ${user.lastName}`
      }))
      state.users = users
    })
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.allCategories = action.payload
    })
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.allTasks = action.payload
    })
    builder.addCase(getProjectDetails.fulfilled, (state, action) => {
      state.projectDetails = action.payload
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
  setTaskLists, setEditTask, setSelectedCategory, setCategories, setEmpty, setProjectMembers
} = appProjects.actions

export default appProjects.reducer
