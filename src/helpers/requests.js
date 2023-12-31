//REGISTER

import { formatDateToYYYYMMDD, formatLocalDate } from './dateFormats'

export const signupRequest = req => {
  const request = {
    id: 0,
    firstName: req.firstName,
    lastName: req.lastName,
    email: req.email,
    password: req.password,
    isActive: true,
    joinedDate: new Date().toISOString()
  }

  return request
}

//ORGANIZATION

export const organizationRequest = req => {
  const request = {
    name: req.name,
    address: req.address,
    organizationSize: req.orgSize,
    city: req.city,
    state: req.state.name,
    country: req.country.name,
    zipcode: req.zipcode,
    website: req.website,
    phone: req.phone,
    isActive: true
  }

  return request
}

//CONFIGURATIONS

export const settingsRequest = req => {
  const request = {
    currency: req.currency?.cc,
    workingdays: [req.startWeekDay, req.endWeekDay].join('-'),
    timeZone: `${req.timezone.name} - ${req.timezone?.offset}`
  }

  return request
}

//TIMESHEET
export const timeSheetRequest = req => {
  const request = {
    id: req.id,
    burnedHours: req.burnedHours,
    timeSheetDate: req.timeSheetDate,
    isBillable: req.isBillable,
    taskId: req.taskId,
    projectId: req.projectId,
    taskCategoryId: req.taskCategoryId
  }

  return request
}

//USERS

export const userRequest = req => {
  const request = req?.id
    ? {
      id: req.id,
      firstName: req.firstName,
      lastName: req.lastName,
      invitationStatus: req.invitationStatus,
      email: req.email,
      password: req.email,
      isActive: true,
      costPerHour: req.costPerHour,
      roleId: req.roleId,
      tenantId: req.tenantId,
      organizationId: req.organizationId,
      joinedDate: req.joinedDate?.toISOString(),
      departmentId: req.departmentId,
      reportingManagerId: req.reportingManagerId,
      skillId: req.skills
    }
    : {
      dateJoined: new Date().toISOString(),
      firstName: req.firstName,
      lastName: req.lastName,
      email: req.email,
      costPerHour: req.cost,
      roleId: req.role,
      reportingManagerId: req.reportingManagerId,
      departmentId: req.departmentId,
      skills: req.skills
    }

  return request
}

//Clients
export const clientRequest = req => {
  const request = req.id
    ? {}
    : {
      companyName: req.companyName,
      profilePhoto: req?.profilePhoto || '',
      primaryContatctName: req.primaryContactName,
      address: req.address,
      email: req.email,
      phoneNumber: req.phoneNumber,
      companyId: req.companyId,
      taxId: req.taxId,
      isActive: req.isActive
    }

  return request
}

//PROJECTS

export const projectRequest = req => {
  const request = {
    name: req.name,
    budget: Number(req.plannedBudget),
    startDate: req.startDate,
    endDate: req.endDate,
    estimatedHours: Number(req.plannedHours),
    skillId: req.skills,
    isActive: true,
    projectTypeId: Number(req.type),
    clientId: req.client,
    departmentId: req.departmentId,
    isBillable: req.isBillable,
    allowUsersToChangeEstHours: req.allowUsersToChangeEstHours,
    allowUsersToCreateNewTask: req.allowUsersToCreateNewTask
  }

  return request
}

export const projectAssigneeRequest = req => {
  const { allocatedProjectCost, projectId, userId, projectRoleId, availablePercentage } = req
  const request = [
    {
      allocatedProjectCost: allocatedProjectCost,
      projectId: projectId,
      userId: userId,
      projectRoleId: projectRoleId,
      availablePercentage: availablePercentage
    }
  ]


  return request
}

export const categoryRequest = (name, isBillable, projectId) => {
  const request = {
    name: name,
    isBillable: isBillable,
    projectId: projectId
    // milestoneId: 1
  }

  return request
}

export const taskRequest = req => {
  const request = {
    id: req.id,
    DueDate: req.dueDate?.toISOString(),
    TaskPriorityId: req.taskPriorityId,
    IsBillable: req.isBillable,
    TaskStatusId: req.taskStatusId,
    ProjectId: req.projectId,
    Files: '',
    TaskEstimatedHours: req.taskEstimatedHours,
    TaskAssignedUserId: req.taskAssignedUserId.id,
    Description: req.description,
    TaskCategoryId: req.taskCategoryId
  }

  return request
}

export const mileStoneRequest = req => {
  const request = {
    name: req.name,
    description: req.description,
    startDate: formatDateToYYYYMMDD(req.startDate),
    endDate: formatDateToYYYYMMDD(req.endDate),
    createdDate: new Date().toISOString(),
    taskCategories: req?.taskCategories || [],
    projectId: req.projectId
  }

  return request
}

//LEAVE MANAGEMENT

export const leavePolicyRequest = req => {
  const request = req.id
    ? {
      leavePolicyId: req.id,
      typeOfLeave: req?.typeOfLeave,
      allowanceCount: !isNaN(req?.allowanceCount) && Number(req?.allowanceCount),
      allowanceTime: !isNaN(req?.allowanceTime) && Number(req?.allowanceTime),
      isPermission: req.isPermission,
      period: req?.period,
      carryForwardCount: !isNaN(req?.carryForwardCount) && Number(req?.carryForwardCount),
      levelOneApprovalLevelId: req.level1,
      levelTwoApprovalLevelId: req.level1 === 3 ? 0 : req.level2
    }
    : {
      typeOfLeave: req?.typeOfLeave,
      allowanceCount: !isNaN(req?.allowanceCount) && Number(req?.allowanceCount),
      allowanceTime: !isNaN(req?.allowanceTime) && Number(req?.allowanceTime),
      isPermission: req.isPermission,
      period: req?.period,
      carryForwardCount: !isNaN(req?.carryForwardCount) && Number(req?.carryForwardCount),
      levelOneApprovalLevelId: req.level1,
      levelTwoApprovalLevelId: req.level1 === 3 ? 0 : req.level2
    }

  return request
}

export const myLeaveRequest = req => {
  const request = req.id
    ? {
      id: req.id,
      requestTypeId: req?.requestTypeId,
      fromDate: req?.fromDate?.toISOString(),
      toDate: req?.toDate?.toISOString(),
      isFromDateHalfDay: req.isFromDateHalfDay,
      isToDateHalfDay: req.isToDateHalfDay,
      requestReason: req?.requestReason,
      submittedUserId: req?.submittedUserId
    }
    : {
      requestTypeId: req?.requestTypeId,
      fromDate: req?.fromDate?.toISOString(),
      toDate: req?.toDate?.toISOString(),
      isFromDateHalfDay: req.isFromDateHalfDay,
      isToDateHalfDay: req.isToDateHalfDay,
      requestReason: req?.requestReason,
      submittedUserId: req?.submittedUserId
    }

  return request
}

export const approvalRequest = req => {
  const request = {
    leaveRequestApprovalId: req.leaveRequestApprovalId,
    leaveRequestId: req.id,
    leaveStatusId: req.leaveStatusId,
    approvalLevelId: req.approvalLevelId,
    comment: req.comment
  }

  return request
}
