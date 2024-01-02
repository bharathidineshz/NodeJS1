/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = role => {
  if (localStorage.getItem('accessToken')) {
    location.href = '/leave-management/my leaves'
  } else {
    location.href = '/login'
  }
}

export default getHomeRoute
