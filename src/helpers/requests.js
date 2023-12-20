//USERS

export const userRequest = req => {
  const request = {
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

//LEAVE MANAGEMENT

export const leavePolicyRequest = req => {
  const request = req.id
    ? {
        id: req.id,
        typeOfLeave: req?.typeOfLeave,
        leaveCount: !isNaN(req?.count) && Number(req?.count),
        period: req?.period,
        carryForward: req?.carryForward,
        carryForwardCount: !isNaN(req?.count) && Number(req?.carryForwardCount),
        approvalLevel: req?.approvalLevel || 1
      }
    : {
        typeOfLeave: req?.typeOfLeave,
        leaveCount: !isNaN(req?.count) && Number(req?.count),
        period: req?.period,
        carryForward: req?.carryForward,
        carryForwardCount: !isNaN(req?.count) && Number(req?.carryForwardCount),
        approvalLevel: req?.approvalLevel || 1
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
        isFromDateHalfDay: false,
        isToDateHalfDay: false,
        requestReason: req?.requestReason,
        currentLevelId: 1,
        submittedUserId: req?.submittedUserId
      }
    : {
        requestTypeId: req?.requestTypeId,
        fromDate: req?.fromDate?.toISOString(),
        toDate: req?.toDate?.toISOString(),
        isFromDateHalfDay: false,
        isToDateHalfDay: false,
        requestReason: req?.requestReason,
        currentLevelId: 1,
        submittedUserId: req?.submittedUserId
      }

  return request
}
