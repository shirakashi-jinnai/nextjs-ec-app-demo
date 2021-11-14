import _ from 'lodash'
import { Grid, CardActionArea, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import data from '../utils/data'
import NextLink from 'next/link'
import Layout from '../components/Layout'
import db from '../utils/db'

const Home = () => {
  return (
    <div>
      <Layout>
        <h1>Product</h1>
        <Grid container spacing={3}>
          {_.map(data.products, (product, key) => (
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
                  <Button size="small">Add to cart</Button>
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
