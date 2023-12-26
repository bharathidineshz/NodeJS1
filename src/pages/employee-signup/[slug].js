import { useRouter } from 'next/router'
import React from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import EmployeeSignup from 'src/pages/employee-signup'

const Signup = () => {
  const router = useRouter()
  const secretString = router.query.slug

  const decodedString = secretString ? Buffer.from(secretString, 'base64').toString('utf-8') : ''

  return <EmployeeSignup data={decodedString} />
}

Signup.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default Signup
