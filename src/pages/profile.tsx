import _ from 'lodash'
import dynamic from 'next/dynamic'
import { useContext, useEffect } from 'react'
import { Store } from '../utils/Store'
import { useRouter } from 'next/router'
import axios from 'axios'
import Layout from '../components/Layout'
import {
  Button,
  Card,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material'
import useStyles from '../utils/styles'
import NextLink from 'next/link'
import { getError } from '../utils/error'
import { useForm, Controller } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import Cookies from 'js-cookie'

function Profile() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { state, dispatch } = useContext(Store)
  const classes = useStyles()
  const router = useRouter()
  const { userInfo } = state

  const submitHandler = async (data: any) => {
    closeSnackbar()
    const { name, email, password } = data

    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } },
      )
      dispatch({ userInfo: data })
      Cookies.set('userInfo', JSON.stringify(data))
      enqueueSnackbar('Profile updated successfully', { variant: 'success' })
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' })
    }
  }
  useEffect(() => {
    if (_.isEmpty(userInfo)) {
      router.push('/login')
    }
    setValue('name', userInfo.name)
    setValue('email', userInfo.email)
  }, [])

  return (
    <Layout title={`Profile`}>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/profile" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="User Profile"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/order-history" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Order History"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h4">
                  Profile
                </Typography>
              </ListItem>
              <ListItem>
                <form
                  onSubmit={handleSubmit(submitHandler)}
                  className={classes.form}
                >
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
                        rules={{
                          validate: (value) =>
                            value === '' ||
                            value.length > 5 ||
                            'Password length is more than 5',
                        }}
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
                                ? 'Password length is more than 5'
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
                        rules={{
                          validate: (value) =>
                            value === '' ||
                            value.length > 5 ||
                            'Confirm Password length is more than 5',
                        }}
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
                                ? 'Password length is more than 5'
                                : ''
                            }
                            {...field}
                          />
                        )}
                      />
                    </ListItem>
                    <ListItem>
                      <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        color="primary"
                      >
                        Update
                      </Button>
                    </ListItem>
                  </List>
                </form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(Profile), { ssr: false })
