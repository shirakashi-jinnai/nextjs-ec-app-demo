import React from 'react'
import NextLink from 'next/link'
import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material'
import Layout from '../components/Layout'
import useStyles from '../utils/styles'

export default function Login() {
  const classes = useStyles()
  return (
    <Layout title="Login">
      <form className={classes.form}>
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
              inputProps={{ type: 'email' }}
            ></TextField>
          </ListItem>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="email"
              label="Email"
              inputProps={{ type: 'password' }}
            ></TextField>
          </ListItem>
          <ListItem>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              color="secondary"
            >
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
