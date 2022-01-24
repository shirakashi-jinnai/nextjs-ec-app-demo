import _ from 'lodash'
import React, { useContext, useEffect } from 'react'
import Layout from '../../components/Layout'
import { Store } from '../../utils/Store'
import useStyles from '../../utils/styles'
import { useRouter } from 'next/router'
import { useReducer } from 'react'
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material'
import Card from '@mui/material/Card'
import NextLink from 'next/link'
import { Button } from '@mui/material'
import { getError } from '../../utils/error'
import axios from 'axios'
import { useSnackbar } from 'notistack'

export default function AdminProducts() {
  const { state } = useContext(Store)
  const classes = useStyles()
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const { userInfo } = state

  const [
    { loading, error, products, loadingCreate, successDelete, loadingDelete },
    setProductsState,
  ] = useReducer((state, dispatch) => _.assign({}, state, dispatch), {
    loading: true,
    products: {},
    error: '',
  })

  const createHandler = async () => {
    try {
      setProductsState({ loadingCreate: true })
      const {
        data: { product },
      } = await axios.post(
        '/api/admin/products',
        {},
        { headers: { authorization: `Bearer ${userInfo.token}` } },
      )
      const objProduct = _(product)
        .transform((acc, val) => (acc[val._id] = val), {})
        .value()
      setProductsState({ loadingCreate: false, products: objProduct })
      enqueueSnackbar('商品の登録が完了いたしました。', { variant: 'success' })
      //   router.push(`/admin/product/${product._id}`)
    } catch (err) {
      setProductsState({ loadingCreate: false })
      enqueueSnackbar(getError(err), { variant: 'error' })
    }
  }

  const deleteHandler = () => {}

  useEffect(() => {
    if (_.isEmpty(userInfo)) {
      router.push('/login')
    }
    const fetchData = async () => {
      try {
        setProductsState({ loading: true })
        const { data } = await axios.get('/api/admin/products', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        })
        const objData = _(data)
          .transform((acc, val) => (acc[val._id] = val), {})
          .value()

        setProductsState({ loading: false, products: objData })
      } catch (err) {
        setProductsState({ loading: false, error: getError(err) })
      }
    }

    if (successDelete) {
      setProductsState({ loadingDelete: false, successDelete: false })
    } else {
      fetchData()
    }
  }, [successDelete])

  return (
    <Layout title="Products">
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
            <List>
              <ListItem>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Typography component={'h1'} variant="h4">
                      Products
                    </Typography>
                  </Grid>
                  <Grid>
                    <Button onClick={createHandler} variant="contained">
                      Create
                    </Button>
                  </Grid>
                </Grid>
              </ListItem>

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
                          <TableCell>NAME</TableCell>
                          <TableCell>PRICE</TableCell>
                          <TableCell>CATEGORY</TableCell>
                          <TableCell>COUNT</TableCell>
                          <TableCell>RATING</TableCell>
                          <TableCell>ACTIONS</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {_(products)
                          .values()
                          .map((product) => (
                            <TableRow key={product._id}>
                              <TableCell>
                                {product._id.substring(20, 24)}
                              </TableCell>
                              <TableCell>{product.name}</TableCell>
                              <TableCell>{product.price}</TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>{product.countInStock}</TableCell>
                              <TableCell>{product.rating}</TableCell>
                              <TableCell>
                                <NextLink
                                  href={`/admin/product/${product._id}`}
                                  passHref
                                >
                                  <Button size="small" variant="contained">
                                    Edit
                                  </Button>
                                </NextLink>
                                <Button
                                  onClick={deleteHandler}
                                  size="small"
                                  variant="contained"
                                  color="error"
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                          .value()}
                      </TableBody>
                    </Table>
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
