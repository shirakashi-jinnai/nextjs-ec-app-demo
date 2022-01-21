import _ from 'lodash'
import dynamic from 'next/dynamic'
import { useContext, useEffect, useReducer } from 'react'
import { Store } from '../utils/Store'
import { useRouter } from 'next/router'
import axios from 'axios'
import Layout from '../components/Layout'
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import useStyles from '../utils/styles'
import NextLink from 'next/link'
import { getError } from '../utils/error'

function OrderHistory() {
  const { state } = useContext(Store)
  const classes = useStyles()
  const router = useRouter()
  const { userInfo } = state

  const [{ loading, error, orders }, setOrderHistoryState] = useReducer(
    (state, dispatch) => _.assign({}, state, dispatch),
    { loading: false, orders: {}, error: '' },
  )
  useEffect(() => {
    if (_.isEmpty(userInfo)) {
      router.push('/login')
    }

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`/api/orders/history`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        })
        const objData = _(data)
          .transform((acc, val) => (acc[val._id] = val), {})
          .value()
        setOrderHistoryState({ orders: objData })
      } catch (err) {
        setOrderHistoryState({ error: getError(err) })
      }
    }
    fetchOrders()
  }, [])

  return (
    <Layout title={`Order History`}>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/profile" passHref>
                <ListItem button component="a">
                  <ListItemText primary="User Profile"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/order-history" passHref>
                <ListItem selected button component="a">
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
                  Order History
                </Typography>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
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
                            <TableCell>{order.createdAt}</TableCell>
                            <TableCell>{order.totalPrice}</TableCell>
                            <TableCell>
                              {order.isPaid
                                ? `paid at ${order.paidAt}`
                                : 'not paid'}
                            </TableCell>
                            <TableCell>
                              {order.delivered
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
                      <TableRow></TableRow>
                    </TableBody>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false })
