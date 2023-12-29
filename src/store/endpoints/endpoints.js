export const baseURL = 'https://kronos-webapi.azurewebsites.net/'

export const endpointURL = endpoint => {
  return baseURL + endpoint
}

export const endpoints = {
  login: 'api/Authorization/Login',
  userByEmail: 'api/User/Get?email=',
  allUsers: 'api/User/GetUsers',

  // refresh token
  refreshtoken: 'api/Account/refresh-token',

  addOrganizationSetup: 'api/Organization/CreateOrganization',
  getOrganizationSetup: 'api/Organization/GetOrganization',
  updateOrganizationSetup: 'api/Organization/UpdateAddOrganization',

  signup: 'api/Account/Signup/',
  logOut: 'api/logout/',
  edituserdetails: 'api/user/manage/',
  tenant: 'api/Tenant',

  userInvite: 'api/User/UserInvite',
  adduser: 'api/User/CreateUser/',
  Updateuser: 'api/User/UpdateUser/',

  Deleteuser: id => `api/User/DeleteUser/${id}`,
  Activateuser: id => `api/User/ActivateUser/${id}`,

  createCategory: 'api/TaskCategory/CreateTaskCategory',
  taskCategories: 'api/TaskCategory',
  getTaskCategoriesbyProjectID: id => `api/TaskCategory?projectId=${id}`,
  deleteTaskCategory: 'api/project/task-category/',

  // timesheet
  getTimesheetList: 'api/TimeSheet/GetTimeSheet',
  getTimesheetwithDateRange: (sdate, edate) =>
    `api/TimeSheet/GetTimeSheet?sdate=${sdate}&edate=${edate}`,

  postTimesheetList: 'api/TimeSheet/CreateTimeSheet',
  putTimesheetList: 'api/TimeSheet/UpdateTimeSheet',
  deleteTimesheetList: id => `api/TimeSheet/DeleteTimeSheet?id=${id}`,
  getTaskbyProject: 'api/TimeSheet/GetTasksForTimeSheet',
  getAssignedProject: 'api/Project/GetProjectsByUser',

  // assign users
  assignUsers: 'api/ProjectMapping/Create',
  updateProjectMap: 'api/ProjectMapping/UpdateProjectMap',
  assignUsersbyProject: id => `api/ProjectMap/ProjectMapping?project_uId=${id}`,

  GetassignedUsersbyEmail: mail => `api/ProjectMap/ProjectMapping?mail=${mail}`,

  updateUsers: 'api/ProjectMap/ProjectMapping/',
  deleteUsers: 'api/ProjectMap/ProjectMapping/',
  allAssignedUsers: 'api/ProjectMap/ProjectMappingAll',

  //REPORTS

  getProjectReportsDetails: id => `/api/Report/GetProjectReports?ProjectId=${id}`,
  getReportsByProjectId: projectId => `api/Report/Reports?projectId=${projectId}`,
  getTimeReportsByProjectUId: projectUId => `api/Report/TimeReports?projectUId=${projectUId}`,
  getGetPercentageByProjectUId: projectUId => `api/Report/getPercentage?projectUId=${projectUId}`,
  getPercentageByProjectId: projectUId => `api/Report/Percentage?projectUId=${projectUId}`,
  getEmployeeReports: (employeeId, fromDate, toDate) => {
    if (fromDate != null && toDate != null) {
      return `api/Report/GetEmployeeReports?employeeid=${employeeId}&fromdate=${fromDate}&todate=${toDate}`
    } else {
      return `api/Report/GetEmployeeReports?employeeid=${employeeId}`
    }
  },
  getGetProjectReports: (projectId, fromDate, toDate) => {
    if (fromDate != null && toDate != null) {
      return `api/Report/GetProjectReports?projectid=${projectId}&fromdate=${fromDate}&todate=${toDate}`
    } else {
      return `api/Report/GetProjectReports?projectid=${projectId}`
    }
  },
  getAllEmployeeReports: (fromDate, toDate) => {
    if (fromDate != null && toDate != null) {
      return `api/Report/GetAllEmployeeReport?FromDate=${fromDate}&ToDate=${toDate}`
    } else {
      return `api/Report/GetAllEmployeeReport`
    }
  },
  getAllClientReports: (fromDate, toDate) => {
    if (fromDate != null && toDate != null) {
      return `api/Report/GetClientReports?FromDate=${fromDate}&ToDate=${toDate}`
    } else {
      return `api/Report/GetClientReports`
    }
  },
  getAllProjectsReport: (fromDate, toDate) => {
    if (fromDate != null && toDate != null) {
      return `api/Report/GetAllProjectsReport?FromDate=${fromDate}&ToDate=${toDate}`
    } else {
      return `api/Report/GetAllProjectsReport`
    }
  },

  getProjectDetails: projectUId => `api/Report/ProjectDetailReport?ProjectUId=${projectUId}`,

  //setting
  getCurrency: 'api/Settings/GetCurrencies',
  postCurrency: 'api/Settings/CreateSettings',

  //Holidays
  getHolidayRequests: 'api/LeavePolicy/GetHolidayRequests',
  addHolidayRequests: 'api/LeavePolicy/CreateHolidayRequest',
  updateHolidayRequests: 'api/LeavePolicy/UpdateHolidayRequest',
  deleteHolidayRequests: 'api/LeavePolicy/DeleteHolidayRequest',

  //client
  addClient: 'api/Client/CreateClient',
  updateClient: 'api/Client/UpdateClient',
  getAllClient: 'api/Client/GetClients',
  deleteClient: id => `api/Client/DeleteClient/${id}`,
  clientById: id => `/api/Client/GetClientById/${id}`,
  editClient: 'api/Client/Update',

  getProjectReport: id => `api/Report?projectUid=${id}`,

  getOrganizationReport: `api/OrganizationReport/GetOrganizationReport`,

  getInvoiceDetails: (id, month, year) =>
    `/api/Invoice/GetProjectInvoice?projectId=${id}&month=${month}&year=${year}`,
  saveInvoice: '/api/Invoice',
  getInvoiceAll: 'api/Invoice/GetInvoices',

  //projects
  projects: 'api/Project',
  getProjects: 'api/Project/GetProject',
  deleteProject: id => `api/Project?id=${id}`,
  projectMembers: id => `api/ProjectAssignee/GetProjectAssigneesByID?projectId=${id}`,
  projectAssignees: 'api/ProjectAssignee',
  projectsByUser: '/api/Project/GetProjectsByUser',

  // tasks
  postTask: 'api/Task/CreateTask',
  putTask: 'api/Task/UpdateTask',
  getTaskList: projectId => `api/Task/GetTasksByProject?ProjectId=${projectId}`,
  deleteTask: id => `api/Task/DeleteTask?id=${id}`,

  //milestone

  mileStones: 'api/Milestone',

  //skills
  skills: 'api/MasterSkill',

  //leave Management

  myLeaves: 'api/LeaveRequest',
  getLeavePolicy: '/api/LeavePolicy/GetLeavePolicy',
  createLeavePolicy: '/api/LeavePolicy/CreateLeavePolicy',
  updateLeavePolicy: 'api/LeavePolicy/UpdatePolicy',
  requests: 'api/LeaveRequest',
  getApprovals: 'api/LeaveRequestApprove/GetLeaveRequestApproval',
  createApproval: 'api/LeaveRequestApprove/CreateLeaveRequestApproval',
  updateApproval: 'api/LeaveRequestApprove/UpdateLeaveRequestApproval',
  deleteLeavePolicy: id => `api/LeavePolicy/DeletePolicy?policyId=${id}`,
  deleteRequest: id => `api/LeaveRequest?requestId=${id}`,

  getStatus: '/api/Status/GetStatus',
  getSkills: 'api/MasterSkill',
  getUserReports: (userId, fromDate, toDate) =>
    `api/Report/GetUserLeaveRequest?UserId=${userId}&FromDate=${fromDate}&ToDate=${toDate}`,
  getDashboard: userId => `api/Report/GetUserLeaveBalance?UserId=${userId}`
}
