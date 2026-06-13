import LoginContainer from '@/containers/auth/login/login'
import React, { Suspense } from 'react'

export default function login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContainer />
    </Suspense>
  )
}
