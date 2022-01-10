import React, { useState, useContext, useEffect } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'
import Layout from '../components/Layout'
import useStyles from '../utils/styles'
import { Store } from '../utils/Store'
import Cookies from 'js-cookie'

type Form = {
  email: string
  password: string
}

export default function Login() {
  const router = useRouter()
  const { redirect } = router.query //login?redirect=/shipping
  const { state, dispatch } = useContext(Store)
  const { userInfo } = state
  const [form, setForm] = useState<Form>({ email: '', password: '' })
  const classes = useStyles()

  const onValueCange = ({ target }) =>
    setForm({ ...form, [target.id]: target.value })

  const submitHandler = async (e: any) => {
    e.preventDefault()
    const { email, password } = form
    try {
      const { data } = await axios.post('/api/users/login', { email, password })
      dispatch({ userInfo: data })
      Cookies.set('userInfo', JSON.stringify(data))
      router.push(redirect || '/')
    } catch (err) {
      alert(err.response.data ? err.response.data.message : err.message)
    }
  }

  useEffect(() => {
    if (userInfo) {
      router.push('/')
    }
  }, [])
  return (
    <Layout title="Login">
      <form onSubmit={submitHandler} className={classes.form}>
        <Typography component={'h1'} variant="h4">
          Login
        </Typography>
        <List>
          <ListItem>
            <TextField
              color="primary"
              variant="outlined"
              fullWidth
              id="email"
              label="Email"
              value={form.email}
              onChange={onValueCange}
              inputProps={{ type: 'email' }}
            />
          </ListItem>
          <ListItem>
            <TextField
              color="primary"
              variant="outlined"
              fullWidth
              id="password"
              label="Password"
              value={form.password}
              onChange={onValueCange}
              inputProps={{ type: 'password' }}
            />
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Login
            </Button>
          </ListItem>
          <ListItem>
            Don't have an account?
            <NextLink href="/register" passHref>
              <Link>Register</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  )
}
