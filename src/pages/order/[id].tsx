import _ from 'lodash'
import React from 'react'
import { useContext, useEffect, useState, useReducer } from 'react'
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
import Layout from '../../components/Layout'
import { Store } from '../../utils/Store'
import { useSnackbar } from 'notistack'
import CheckoutWizard from '../../components/CheckoutWizard'
import useStyles from '../../utils/styles'
import { getError } from '../../utils/error'

function Order({ params }) {
  const router = useRouter()
  const orderId = params.id //router.query.idと同義
  const classes = useStyles()
  const { state } = useContext(Store)
  const { userInfo } = state
  console.log(router.query.id)

  const [{ loading, error, order }, setOrderState] = useReducer(
    (state, dispatch) => _.assign({}, state, dispatch),
    {
      loading: true,
      order: {},
      error: '',
    },
  )

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order

  useEffect(() => {
    if (_.isEmpty(userInfo)) {
      router.push(`/login?redirect=${router.pathname}`)
    }
    const fetchOrder = async () => {
      console.log('fetchorder')
      try {
        setOrderState({ loading: true })
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        })
        setOrderState({ order: data, loading: false })
      } catch (err) {
        setOrderState({ loading: false, error: getError(err) })
        // enqueueSnackbar(getError(err), { variant: 'error' })
      }
    }
    if (_.isEmpty(order._id) || (order._id && order._id !== orderId)) {
      fetchOrder()
    }
  }, [order])

  console.log(order)

  const OrderDetailsArea = () => (
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
              {shippingAddress.fullName},{shippingAddress.address},
              {shippingAddress.city},{shippingAddress.postalCode},
              {shippingAddress.country}
            </ListItem>
            <ListItem>
              Status:
              {isDelivered ? `delivered at ${deliveredAt}` : `not delivered`}
            </ListItem>
          </Card>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component={'h2'} variant="h5">
                  Payment Method
                </Typography>
              </ListItem>
              <ListItem>{paymentMethod}</ListItem>
              <ListItem>
                Status:
                {isPaid ? `paid at ${paidAt}` : `not paid`}
              </ListItem>
            </List>
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
                      {_.map(_.values(orderItems), (item, i) => (
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
            </List>
          </Card>
        </Grid>
      </Grid>
    </>
  )

  return (
    <Layout title={`Order ${orderId}`}>
      <CheckoutWizard activeStep={4} />
      <Typography component={'h1'} variant="h4">
        Order {orderId}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography className={classes.error}>{error}</Typography>
      ) : (
        <OrderDetailsArea />
      )}
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  }
}

export default dynamic(() => Promise.resolve(Order), { ssr: false })
