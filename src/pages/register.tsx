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

export default function Register() {
  const router = useRouter()
  const { redirect } = router.query //login?redirect=/shipping
  const { state, dispatch } = useContext(Store)
  const { userInfo } = state
  const [form, setForm] = useState<any>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const classes = useStyles()

  const onValueCange = ({ target }) =>
    setForm({ ...form, [target.id]: target.value })

  const submitHandler = async (e: any) => {
    e.preventDefault()
    const { name, email, password, confirmPassword } = form
    if (password !== confirmPassword) {
      alert("password don't match")
      return
    }
    try {
      const { data } = await axios.post('/api/users/register', {
        name,
        email,
        password,
      })
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
    <Layout title="Register">
      <form onSubmit={submitHandler} className={classes.form}>
        <Typography component={'h1'} variant="h4">
          Register
        </Typography>
        <List>
          <ListItem>
            <TextField
              color="primary"
              variant="outlined"
              fullWidth
              id="name"
              label="Name"
              value={form.name}
              onChange={onValueCange}
              inputProps={{ type: 'text' }}
            />
          </ListItem>
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
            <TextField
              color="primary"
              variant="outlined"
              fullWidth
              id="confirmPassword"
              label="Confirm Password"
              value={form.confirmPassword}
              onChange={onValueCange}
              inputProps={{ type: 'password' }}
            />
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Register
            </Button>
          </ListItem>
          <ListItem>
            Already have an account? &nbsp;
            <NextLink href={`/login?redirect=${redirect || '/'}`} passHref>
              <Link>Login</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  )
}
