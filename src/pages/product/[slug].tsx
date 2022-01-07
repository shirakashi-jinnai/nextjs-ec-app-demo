import axios from 'axios'
import React, { useContext } from 'react'
import { useRouter } from 'next/dist/client/router'
import NextLink from 'next/link'
import Image from 'next/image'
import Cookies from 'js-cookie'
import db from '../../utils/db'
import { Button, Grid, Link, List, ListItem, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import Layout from '../../components/Layout'
import data from '../../utils/data'
import useStyles from '../../utils/styles'
import { Store } from '../../utils/Store'
import { Product } from '../../models/Product'

export default function ProductScreen(props) {
  const { product } = props
  const { state, dispath } = useContext(Store)
  const classes = useStyles()
  // const product = data.products.find((a) => a.slug === slug)

  if (!product) {
    return <div>Product Not Found</div>
  }
  const addToCartHandler = async () => {
    const { data } = await axios.get(`/api/products/${product._id}`)
    console.log('data', data)
    if (data.countInStock <= 0) {
      window.alert('Sorry. Product is out of stock')
      return
    }
    await dispath({
      cart: {
        // ...state.cart,
        cartItems: {
          ...state.cart.cartItems,
          [product._id]: { ...data, quantity: 1 },
        },
      },
    })
    Cookies.set(
      'cartItems',
      JSON.stringify({
        ...state.cart.cartItems,
        [product._id]: { ...data, quantity: 1 },
      }),
    )
    console.log('state', state.cart)
  }
  return (
    <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        <Typography>{product.name}</Typography>
        <NextLink href="/" passHref>
          <Link>back to products</Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          ></Image>
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component="h1" variant="h3">
                {product.name}
              </Typography>{' '}
            </ListItem>
            <ListItem>
              <Typography>Category:{product.category}</Typography>{' '}
            </ListItem>
            <ListItem>
              <Typography>Brand:{product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Rating:{product.rating} stars ({product.numReviews} reviews)
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Description:{product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>${product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      ${product.countInStock > 0 ? 'In stock' : 'Unavailable'}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={addToCartHandler}
                >
                  Add to cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}

export async function getServerSideProps(context: any) {
  const { params } = context
  const { slug } = params
  console.log(slug)
  await db.connect()
  // lean()はクエリ結果を変更したり、ゲッターや変換などの機能に依存したりする場合は、を使用しないでください（公式）
  const data = await Product.findOne({ slug }).lean()
  console.log('data  ', data)
  //created_at,updated_atなどのdate型は一旦文字列に変換しなおしてからでないとエラーが発生する
  const product = JSON.parse(JSON.stringify(data))
  // console.log(data, products)
  await db.disconnect()
  return {
    props: {
      product,
    },
  }
}
