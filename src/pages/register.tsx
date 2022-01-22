import React, { useState, useContext, useEffect } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'
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
import { getError } from '../utils/error'

type Form = {
  email: string
  password: string
}

export default function Register() {
  const router = useRouter()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm()

  const { redirect } = router.query //login?redirect=/shipping
  const { state, dispatch } = useContext(Store)
  const { userInfo } = state
  const classes = useStyles()

  const submitHandler = async (data: any) => {
    closeSnackbar()
    const { name, email, password, confirmPassword } = data
    if (password !== confirmPassword) {
      enqueueSnackbar("Password don't match", {
        variant: 'error',
      })
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
      enqueueSnackbar(getError(err), { variant: 'error' })
    }
  }

  useEffect(() => {
    if (userInfo) {
      router.push('/')
    }
  }, [])

  return (
    <Layout title="Register">
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Typography component={'h1'} variant="h4">
          Register
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="name"
              defaultValue=""
              control={control}
              rules={{ required: true, minLength: 2 }}
              render={({ field }) => (
                <TextField
                  color="primary"
                  variant="outlined"
                  fullWidth
                  id="name"
                  label="Name"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.name)}
                  helperText={
                    errors.name
                      ? errors.name.type === 'minLength'
                        ? 'Name length is more than 1'
                        : 'Name is required'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  color="primary"
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email"
                  inputProps={{ type: 'email' }}
                  error={errors.email}
                  helperText={
                    errors.email
                      ? errors.email.type === 'pattern'
                        ? 'Email is not valid'
                        : 'Email is required'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="password"
              defaultValue=""
              control={control}
              rules={{ required: true, minLength: 6 }}
              render={({ field }) => (
                <TextField
                  color="primary"
                  variant="outlined"
                  fullWidth
                  id="password"
                  label="Password"
                  inputProps={{ type: 'password' }}
                  error={errors.password}
                  helperText={
                    errors.password
                      ? errors.password.type === 'minLength'
                        ? 'Password length is more than 5'
                        : 'Password is required'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="confirmPassword"
              defaultValue=""
              control={control}
              rules={{ required: true, minLength: 6 }}
              render={({ field }) => (
                <TextField
                  color="primary"
                  variant="outlined"
                  fullWidth
                  id="confirmPassword"
                  label="ConfirmPassword"
                  inputProps={{ type: 'password' }}
                  error={errors.confirmPassword}
                  helperText={
                    errors.confirmPassword
                      ? errors.confirmPassword.type === 'minLength'
                        ? 'Confirm Password length is more than 5'
                        : 'Confirm Password  is required'
                      : ''
                  }
                  {...field}
                />
              )}
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
