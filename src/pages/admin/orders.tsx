import _ from 'lodash'
import React, { useContext, useEffect } from 'react'
import Layout from '../../components/Layout'
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from '@mui/material'
import { useRouter } from 'next/dist/client/router'
import { Store } from '../../utils/Store'
import useStyles from '../../utils/styles'
import { useReducer } from 'react'
import { getError } from '../../utils/error'
import axios from 'axios'
import Card from '@mui/material/Card'
import NextLink from 'next/link'

export default function AdminOrders() {
  const { state } = useContext(Store)
  const router = useRouter()
  const classes = useStyles()
  const { userInfo } = state

  const [{ loading, error, orders }, setAdminOrdersState] = useReducer(
    (state, dispatch) => _.assign({}, state, dispatch),
    {
      loading: true,
      orders: {},
      error: '',
    },
  )

  useEffect(() => {
    if (_.isEmpty(userInfo)) {
      router.push('/login')
    }

    const fetchData = async () => {
      try {
        setAdminOrdersState({ loading: true })
        const { data } = await axios.get('/api/admin/orders', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        })
        const objData = _(data)
          .transform((acc, val) => (acc[val._id] = val), {})
          .value()
        setAdminOrdersState({ loading: false, orders: objData })
      } catch (err) {
        setAdminOrdersState({ loading: false, error: getError(err) })
      }
    }

    fetchData()
  }, [])

  console.log(orders, error)

  return (
    <Layout title="Orders">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Admin Dashboard"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Orders"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Products"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/users" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Users"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <Typography component={'h1'} variant="h4">
              Orders
            </Typography>

            <ListItem>
              {loading ? (
                <CircularProgress />
              ) : error ? (
                <Typography className={classes.error}>{error}</Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>USER</TableCell>
                        <TableCell>DATE</TableCell>
                        <TableCell>TOTAL</TableCell>
                        <TableCell>PAID</TableCell>
                        <TableCell>DELIVERED</TableCell>
                        <TableCell>ACTION</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {_(orders)
                        .values()
                        .map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order._id.substring(20, 24)}</TableCell>
                            <TableCell>
                              {order.user.name || 'DELETED USER'}
                            </TableCell>
                            <TableCell>{order.createdAt}</TableCell>
                            <TableCell>{order.totalPrice}</TableCell>
                            <TableCell>
                              {order.isPaid
                                ? `paid at ${order.paidAt}`
                                : 'not paid'}
                            </TableCell>
                            <TableCell>
                              {order.isDelivered
                                ? `delivered at ${order.deliveredAt}`
                                : 'not delivered'}
                            </TableCell>
                            <TableCell>
                              <NextLink href={`/order/${order._id}`} passHref>
                                <Button variant="contained">Details</Button>
                              </NextLink>
                            </TableCell>
                          </TableRow>
                        ))
                        .value()}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </ListItem>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}
