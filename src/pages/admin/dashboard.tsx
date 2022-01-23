import _ from 'lodash'
import { useContext, useEffect, useReducer, useRef } from 'react'
import 'chart.js/auto'
import { Chart, Line, getDatasetAtEvent, Bar } from 'react-chartjs-2'
import { Store } from '../../utils/Store'
import { useRouter } from 'next/router'
import useStyles from '../../utils/styles'
import { getError } from '../../utils/error'
import axios from 'axios'
import Layout from '../../components/Layout'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import NextLink from 'next/link'

export default function AdminDashboard() {
  const { state } = useContext(Store)
  const router = useRouter()
  const classes = useStyles()
  const { userInfo } = state
  const chartRef = useRef()

  const [{ loading, error, summary }, setDashboardState] = useReducer(
    (state, dispatch) => _.assign({}, state, dispatch),
    {
      loading: true,
      summary: { salesData: [] },
      error: '',
    },
  )

  useEffect(() => {
    if (_.isEmpty(userInfo)) {
      router.push('/login')
    }

    const fetchData = async () => {
      try {
        setDashboardState({ loading: true })
        const { data } = await axios.get('/api/admin/summary', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        })
        setDashboardState({ loading: false, summary: data })
      } catch (err) {
        setDashboardState({ error: getError(err), loading: false })
      }
    }
    fetchData()
  }, [])
  console.log(summary)
  return (
    <Layout title="Admin Dashboard">
      <Grid spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Admin Dashboard"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem button component="a">
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
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <Grid container spacing={5}>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h4">
                            ${summary.ordersPrice}
                          </Typography>
                          <Typography>Sales</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href="/admin/orders" passHref>
                            <Button size="small" color="primary">
                              View sales
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>

                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h4">
                            {summary.ordersCount}
                          </Typography>
                          <Typography>Orders</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href="/admin/orders" passHref>
                            <Button size="small" color="primary">
                              View orders
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>

                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h4">
                            {summary.productsCount}
                          </Typography>
                          <Typography>Products</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href="/admin/products" passHref>
                            <Button size="small" color="primary">
                              View products
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>

                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h4">
                            {summary.usersCount}
                          </Typography>
                          <Typography>Users</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href="/admin/users" passHref>
                            <Button size="small" color="primary">
                              View users
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </ListItem>
              <ListItem>
                <Typography component="h1" variant="h4">
                  Sales Chart
                </Typography>
              </ListItem>
              <ListItem>
                <Bar
                  data={{
                    labels: summary.salesData.map((val) => val._id),
                    datasets: [
                      {
                        label: 'Sales',
                        backgroundColor: 'rgba(162, 222, 208, 1)',
                        data: summary.salesData.map((val) => val.totalSales),
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: { display: true, position: 'right' },
                    },
                  }}
                />
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}
