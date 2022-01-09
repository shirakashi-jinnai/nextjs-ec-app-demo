import _ from 'lodash'
import React from 'react'
import { useContext } from 'react'
import NextLink from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import axios from 'axios'
import Cookies from 'js-cookie'
import {
  Button,
  Card,
  FormControl,
  Grid,
  Link,
  List,
  ListItem,
  MenuItem,
  Select,
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

function CartScreen() {
  const { state, dispatch } = useContext(Store)
  const { cartItems } = state.cart

  const updateCartHandler = async (item: any, quantity: number) => {
    const { data } = await axios.get(`/api/products/${item._id}`)
    if (data.countInStock <= 0) {
      window.alert('Sorry. Product is out of stock')
      return
    }
    dispatch({
      cart: {
        ...state.cart,
        cartItems: {
          ...state.cart.cartItems,
          [item._id]: { ...item, quantity },
        },
      },
    })
  }

  const removeItemHandler = (item: any) => {
    const filteredItems = _(state.cart.cartItems)
      .filter((v) => v._id !== item._id)
      .transform((acc, val) => (acc[val._id] = val), {})
      .value()

    dispatch({ cart: { cartItems: filteredItems } })
    Cookies.set('cartItems', JSON.stringify(filteredItems))
  }

  const CartItemsArea = () => (
    <>
      {_.isEmpty(cartItems) ? (
        <div>
          Cart is empty.{' '}
          <NextLink href="/">
            <Link>Go shopping</Link>
          </NextLink>
        </div>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Action</TableCell>
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
                      <TableCell align="right">
                        <FormControl variant="standard">
                          <Select
                            value={item.quantity}
                            label={item.quantity}
                            onChange={(e) =>
                              updateCartHandler(item, e.target.value)
                            }
                            style={{ color: 'black' }}
                          >
                            {[...Array(Number(item.countInStock)).keys()].map(
                              (x) => (
                                <MenuItem key={x + 1} value={x + 1}>
                                  {x + 1}
                                </MenuItem>
                              ),
                            )}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="right">${item.price}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => removeItemHandler(item)}
                        >
                          x
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant="h4">
                    Subtotal(
                    {_.values(cartItems).reduce(
                      (acc, cal) => acc + cal.quantity,
                      0,
                    )}
                    items): $
                    {_.values(cartItems).reduce(
                      (acc, cal) => acc + cal.quantity * cal.price,
                      0,
                    )}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button variant="contained" color="primary" fullWidth>
                    Check Out
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  )

  return (
    <Layout title="Shopping Cart">
      <Typography component={'h1'} variant="h4">
        Shopping Cart
      </Typography>
      <CartItemsArea />
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false })
