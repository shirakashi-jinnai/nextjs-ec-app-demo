import _ from 'lodash'
import React, { useState, useContext, useEffect } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
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
import CheckoutWizard from '../components/CheckoutWizard'

type Form = {
  email: string
  password: string
}

export default function Shipping() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue,
  } = useForm()

  const { state, dispatch } = useContext(Store)
  const {
    userInfo,
    cart: { shippingAddress },
  } = state
  const classes = useStyles()

  console.log(state)

  const submitHandler = async (data: any) => {
    const { fullName, address, city, postalCode, country } = data
    dispatch({
      cart: {
        ...state.cart,
        shippingAddress: { fullName, address, city, postalCode, country },
      },
    })
    Cookies.set(
      'shippingAddress',
      JSON.stringify({ fullName, address, city, postalCode, country }),
    )
    router.push('/payment')
  }

  useEffect(() => {
    if (_.isEmpty(userInfo)) {
      router.push(`/login?redirect=${router.pathname}`)
    }
    if (shippingAddress) {
      setValue('fullName', shippingAddress.fullName)
      setValue('address', shippingAddress.address)
      setValue('city', shippingAddress.city)
      setValue('postalCode', shippingAddress.postalCode)
      setValue('country', shippingAddress.country)
    }
  }, [])

  return (
    <Layout title="Shipping">
      <CheckoutWizard activeStep={1} />
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Typography component={'h1'} variant="h4">
          Shipping Address
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="fullName"
              defaultValue=""
              control={control}
              rules={{ required: true, minLength: 2 }}
              render={({ field }) => (
                <TextField
                  color="primary"
                  variant="outlined"
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.fullName)}
                  helperText={
                    errors.fullName
                      ? errors.fullName.type === 'minLength'
                        ? 'Full Name length is more than 1'
                        : 'Full Name is required'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="address"
              defaultValue=""
              control={control}
              rules={{ required: true, minLength: 2 }}
              render={({ field }) => (
                <TextField
                  color="primary"
                  variant="outlined"
                  fullWidth
                  id="address"
                  label="Address"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.address)}
                  helperText={
                    errors.fullName
                      ? errors.address.type === 'minLength'
                        ? 'Address length is more than 1'
                        : 'Address is required'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="city"
              defaultValue=""
              control={control}
              rules={{ required: true, minLength: 2 }}
              render={({ field }) => (
                <TextField
                  color="primary"
                  variant="outlined"
                  fullWidth
                  id="city"
                  label="City"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.city)}
                  helperText={
                    errors.city
                      ? errors.city.type === 'minLength'
                        ? 'City length is more than 1'
                        : 'City is required'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="postalCode"
              defaultValue=""
              control={control}
              rules={{ required: true, minLength: 2 }}
              render={({ field }) => (
                <TextField
                  color="primary"
                  variant="outlined"
                  fullWidth
                  id="postalCode"
                  label="Postal Code"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.postalCode)}
                  helperText={
                    errors.postalCode
                      ? errors.postalCode.type === 'minLength'
                        ? 'Postal Code length is more than 1'
                        : 'Postal Code is required'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="country"
              defaultValue=""
              control={control}
              rules={{ required: true, minLength: 2 }}
              render={({ field }) => (
                <TextField
                  color="primary"
                  variant="outlined"
                  fullWidth
                  id="country"
                  label="Country"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.country)}
                  helperText={
                    errors.country
                      ? errors.country.type === 'minLength'
                        ? 'Country length is more than 1'
                        : 'Country is required'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Continue
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  )
}
