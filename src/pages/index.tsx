import _ from 'lodash'
import { useContext } from 'react'
import { useRouter } from 'next/dist/client/router'
import NextLink from 'next/link'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Grid, CardActionArea, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Layout from '../components/Layout'
import db from '../utils/db'
import { Product } from '../models/Product'
import { Store } from '../utils/Store'
import data from '../utils/data'

const Home = (props) => {
  const { products } = props
  const { addToCartHandler } = useContext(Store)
  const router = useRouter()

  return (
    <div>
      <Layout>
        <h1>Product</h1>
        <Grid container spacing={3}>
          {_.map(products, (product, key) => (
            <Grid item md={4} key={product.name}>
              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={product.image}
                      title={product.name}
                    />
                    <CardContent>
                      <Typography>{product.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>

                <CardActions>
                  <Typography>${product.price}</Typography>
                  <Button
                    size="small"
                    onClick={() => addToCartHandler(product)}
                  >
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Layout>
    </div>
  )
}

export default Home

export async function getServerSideProps() {
  await db.connect()

  // lean()はクエリ結果を変更したり、ゲッターや変換などの機能に依存したりする場合は、を使用しないでください（公式）
  const data = await Product.find({}).lean()

  //created_at,updated_atなどのdate型は一旦文字列に変換しなおしてからでないとエラーが発生する
  const products = JSON.parse(JSON.stringify(data))
  // console.log(data, products)
  await db.disconnect()
  return {
    props: {
      products,
    },
  }
}
