import _ from 'lodash'
import React from 'react'
import { useContext } from 'react'
import NextLink from 'next/link'
import Image from 'next/image'
import {
  Button,
  Card,
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

export default function CartScreen() {
  const { state } = useContext(Store)
  const { cartItems } = state.cart

  const CartItemsArea = () => (
    <>
      {_.isEmpty(cartItems) ? (
        <div>
          Cart is empty
          <NextLink href="/">Go shopping</NextLink>
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
                        <Select value={item.quantity}>
                          {[...Array(Number(item.countInStock)).keys()].map(
                            (x) => (
                              <MenuItem key={x + 1} value={x + 1}>
                                {x + 1}
                              </MenuItem>
                            ),
                          )}
                        </Select>
                      </TableCell>
                      <TableCell align="right">${item.price}</TableCell>
                      <TableCell align="right">
                        <Button variant="contained" color="secondary">
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
                  <Typography variant="h2">
                    Subtotal(
                    {_.values(cartItems).reduce((a, c) => a + c.quantity, 0)}
                    {''}
                    items): $
                    {_.values(cartItems).reduce(
                      (a, c) => a + c.quantity * c.price,
                      0,
                    )}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button></Button>
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
      <Typography component={'h1'} variant="h1">
        Shopping Cart
      </Typography>
      <CartItemsArea />
    </Layout>
  )
}
