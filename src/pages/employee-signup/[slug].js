import { useRouter } from 'next/router'
import React from 'react'
import EmployeeSignup from 'src/pages/employee-signup'

const Signup = () => {
  const router = useRouter()
  const secretString = router.query.slug
  const decodedString = secretString
    ? Buffer.from(secretString.split('k=')[1], 'base64').toString('utf-8')
    : ''

  return <EmployeeSignup data={JSON.parse(decodedString || null)} />
}

export default Signup
