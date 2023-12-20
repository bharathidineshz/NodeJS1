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

  addOrganizationSetup: 'api/Organization/AddOrganization',
  getOrganizationSetup: 'api/Organization/GetOrganization',
  updateOrganizationSetup: 'api/Organization/UpdateAddOrganization',

  signup: 'api/Account/Signup/',
  logOut: 'api/logout/',
  edituserdetails: 'api/user/manage/',
  tenant: 'api/Tenant',

  adduser: 'api/User/CreateUser/',
  Updateuser: 'api/User/UpdateUser/',

  Deleteuser: mail => `api/User/DeleteUser?email=${mail}`,
  getProjects: 'api/Project/Get',
  getProjectById: 'api/Project/?id=',
  getAllProjects: 'api/Project/GetProjects',
  getProjectsbyEmail: email => `api/ProjectMap/ProjectMapping/?mail=${email}`,
  getAssignedProjects: `api/Project/GetAssignedProjects`,

  createProject: 'api/Project/Create',
  putProjects: 'api/Project/Update',
  deleteProject: projectUId => `api/Project/Delete?uId=${projectUId}`,

  postTaskCategory: 'api/TaskCategory/',
  putTaskCategory: 'api/TaskCategory',
  getAllProjectTask: 'api/project/task-category/all/',
  getTaskCategoriesbyProjectID: id => `api/TaskCategory?projectId=${id}`,
  deleteTaskCategory: 'api/project/task-category/',

  postTask: 'api/Task',
  putTask: 'api/Task',
  getTask: 'api/Task',

  getTimesheetList: 'api/timesheet',
  getTimesheetwithDateRange: (sdate, edate) => `api/timesheet/?sdate=${sdate}&edate=${edate}`,

  postTimesheetList: 'api/TimeSheet',
  putTimesheetList: 'api/TimeSheet/UpdateTimeSheet',
  deleteTimesheetList: id => `api/TimeSheet?ts_mapping_uid=${id}`,

  // assign users
  assignUsers: 'api/ProjectMapping/Create',
  updateProjectMap: 'api/ProjectMapping/UpdateProjectMap',
  assignUsersbyProject: id => `api/ProjectMap/ProjectMapping?project_uId=${id}`,

  GetassignedUsersbyEmail: mail => `api/ProjectMap/ProjectMapping?mail=${mail}`,

  updateUsers: 'api/ProjectMap/ProjectMapping/',
  deleteUsers: 'api/ProjectMap/ProjectMapping/',
  allAssignedUsers: 'api/ProjectMap/ProjectMappingAll',

  //REPORTS
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
  getHolidayRequests: 'api/HolidayCalendar/GetHolidayRequests',
  addHolidayRequests: 'api/HolidayCalendar/CreateHolidayRequest',
  updateHolidayRequests: 'api/HolidayCalendar/UpdateHolidayRequest',
  deleteHolidayRequests: 'api/HolidayCalendar/DeleteHolidayRequest',

  // add client
  addClient: 'api/Client/Create',
  getAllClient: 'api/Client/GetClients',
  deletClient: 'api/Client/Delete',
  deleteClient: id => `api/Client?ClientUId=${id}`,
  editClient: 'api/Client/Update',

  getProjectReport: id => `api/Report?projectUid=${id}`,

  getOrganizationReport: `api/OrganizationReport/GetOrganizationReport`,

  getInvoiceDetails: (id, month, year) =>
    `/api/Invoice/GetProjectInvoice?projectId=${id}&month=${month}&year=${year}`,
  saveInvoice: '/api/Invoice',
  getInvoiceAll: 'api/Invoice/GetInvoices',

  //leave Management

  deleteLeavePolicy: id => `api/LeavePolicy?policyId=${id}`,
  myLeaves: 'api/LeaveRequest',
  getLeavePolicy: '/api/LeavePolicy/GetLeavePolicy',
  createLeavePolicy: '/api/LeavePolicy/CreateLeavePolicy',
  requestTypes: 'api/LeaveRequest',
  getApprovals: 'api/LeaveRequestApprove/GetLeaveRequestApproval',

  getStatus: '/api/Status/GetStatus',
  getSkills: 'api/MasterSkill/GetSkills',
  getUserReports: (userId, fromDate, toDate) =>
    `api/Report/getUserLeaveRequest?UserId=${userId}&FromDate=${fromDate}&ToDate=${toDate}`,
  getDashboard: userId => `api/Report/getUserLeaveRequest?UserId=${userId}`
}
