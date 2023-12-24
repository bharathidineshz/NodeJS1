/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = role => {
  if(localStorage.getItem("accessToken")){
    location.href = "/apps/timesheets"
  }else{
    location.href = "/login"
  }
}

export default getHomeRoute
