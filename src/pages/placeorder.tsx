import _ from 'lodash'
import React from 'react'
import { useContext, useEffect, useState } from 'react'
import NextLink from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/dist/client/router'
import axios from 'axios'
import Cookies from 'js-cookie'
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import Layout from '../components/Layout'
import { Store } from '../utils/Store'
import { useSnackbar } from 'notistack'
import CheckoutWizard from '../components/CheckoutWizard'
import useStyles from '../utils/styles'
import { getError } from '../utils/error'

function PalaceOrder() {
  const classes = useStyles()
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const {
    userInfo,
    cart: { cartItems, shippingAddress, paymentMethod },
  } = state
  const { fullName, address, city, postalCode, country } = shippingAddress
  const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100 // 123.456 => 123.46
  const itemsPrice = round2(
    _.values(cartItems).reduce((a, c) => a + c.price, 0),
  )
  const shippingPrice = itemsPrice > 200 ? 0 : 15
  const taxPrice = round2(itemsPrice * 0.15)
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)
  const [loading, setLoading] = useState(false)

  const placeOrderHandler = async () => {
    closeSnackbar()
    try {
      setLoading(true)
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: _.values(cartItems),
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        },
      )
      dispatch({
        cart: { ...state.cart, cartItems: {} },
      })
      Cookies.remove('cartItems')
      setLoading(false)
      router.push(`/order/${data._id}`)
    } catch (err) {
      setLoading(false)
      enqueueSnackbar(getError(err), { variant: 'error' })
    }
  }

  useEffect(() => {
    if (_.isEmpty(paymentMethod)) {
      router.push(`/payment`)
    }
    if (_.isEmpty(cartItems)) {
      router.push('/cart')
    }
  }, [])

  const CartItemsArea = () => (
    <>
      <Grid container spacing={1}>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <ListItem>
              <Typography component={'h2'} variant="h5">
                Shipping Address
              </Typography>
            </ListItem>
            <ListItem>
              {fullName},{address},{city},{postalCode},{country}
            </ListItem>
          </Card>
          <Card className={classes.section}>
            <ListItem>
              <Typography component={'h2'} variant="h5">
                Payment Method
              </Typography>
            </ListItem>
            <ListItem>{paymentMethod}</ListItem>
          </Card>

          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component={'h2'} variant="h5">
                  Order Items
                </Typography>
              </ListItem>
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {_.map(_.values(cartItems), (item, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <NextLink href={`product/${item.slug}`} passHref>
                              <Link>
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={50}
                                  height={50}
                                ></Image>
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell>
                            <NextLink href={`product/${item.slug}`} passHref>
                              <Link>
                                <Typography>{item.name}</Typography>
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">${item.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component={'h1'} variant="h4">
                  Order Summary
                </Typography>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Items:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">${itemsPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Tax:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">${taxPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Shipping:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">${shippingPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>
                      <strong>Total:</strong>{' '}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">
                      <strong>${totalPrice}</strong>{' '}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                <Button
                  onClick={placeOrderHandler}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Price Order
                </Button>
              </ListItem>
              {loading && (
                <ListItem>
                  <CircularProgress />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </>
  )

  return (
    <Layout title="Place Order">
      <CheckoutWizard activeStep={3} />
      <Typography component={'h1'} variant="h4">
        Place Order
      </Typography>
      <CartItemsArea />
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(PalaceOrder), { ssr: false })
