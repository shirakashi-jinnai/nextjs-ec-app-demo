import _ from 'lodash'
import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/dist/client/router'
import Cookies from 'js-cookie'
import CheckoutWizard from '../components/CheckoutWizard'
import Layout from '../components/Layout'
import { Store } from '../utils/Store'
import useStyles from '../utils/styles'
import { useSnackbar } from 'notistack'
import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'

export default function Payment() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const router = useRouter()
  const classes = useStyles()
  const [paymentMethod, setPaymentMethod] = useState('')
  const { state, dispatch } = useContext(Store)
  const {
    cart: { shippingAddress },
  } = state

  const submitHandler = (e) => {
    closeSnackbar()
    e.preventDefault()
    if (_.isEmpty(paymentMethod)) {
      enqueueSnackbar('Payment method is required', { variant: 'error' })
    } else {
      dispatch({ cart: { ...state.cart, paymentMethod } })
      Cookies.set('paymentMethod', paymentMethod)
      router.push('/placeorder')
    }
  }

  useEffect(() => {
    if (_.isEmpty(shippingAddress.address)) {
      router.push('/shipping')
    } else {
      setPaymentMethod(Cookies.get('paymentMethod') || '')
    }
  }, [])

  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />
      <form className={classes.form} onSubmit={submitHandler}>
        <Typography component="h1" variant="h4">
          Payment Method
        </Typography>
        <List>
          <ListItem>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="Paymet Method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  label="PayPal"
                  value="PayPal"
                  control={<Radio />}
                />
                <FormControlLabel
                  label="Stripe"
                  value="Stripe"
                  control={<Radio />}
                />
                <FormControlLabel
                  label="Cash"
                  value="Cash"
                  control={<Radio />}
                />
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button fullWidth type="submit" variant="contained" color="primary">
              Continue
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              type="button"
              variant="outlined"
              onClick={() => router.push('/shipping')}
            >
              Back
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  )
}
