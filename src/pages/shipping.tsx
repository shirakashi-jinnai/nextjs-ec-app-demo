import _ from 'lodash'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { Store } from '../utils/Store'

export default function Shipping() {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const { userInfo } = state

  useEffect(() => {
    if (_.isEmpty(userInfo)) {
      router.push(`/login?redirect=${router.pathname}`)
    }
  }, [])
  //   router.push('/login')
  return <div>Shipping</div>
}
