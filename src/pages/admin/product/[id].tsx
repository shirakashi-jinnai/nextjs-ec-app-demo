import _ from 'lodash'
import React, { useContext, useEffect, useReducer } from 'react'
import Layout from '../../../components/Layout'
import NextLink from 'next/link'
import { Controller, useForm } from 'react-hook-form'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import Card from '@mui/material/Card'
import {
  List,
  ListItem,
  ListItemText,
  Grid,
  CircularProgress,
  TextField,
} from '@mui/material'
import { Typography, Button } from '@mui/material'
import { Store } from '../../../utils/Store'
import useStyles from '../../../utils/styles'
import CardContent from '@mui/material/CardContent'
import { getError } from '../../../utils/error'
import { useRouter } from 'next/dist/client/router'

export default function ProductEdit({ params }) {
  const { state } = useContext(Store)
  const router = useRouter()
  const classes = useStyles()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { userInfo } = state
  const productId = params.id
  const {
    handleSubmit,
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm()

  const [
    { loading, error, loadingUpdate, loadingUpload },
    setEditState,
  ] = useReducer((state, dispatch) => _.assign({}, state, dispatch), {
    loading: true,
    error: '',
  })

  const uploadHandler = async (e, imageField = 'image') => {
    const file = e.target.files[0]
    const bodyFormData = new FormData()
    bodyFormData.append('file', file)
    try {
      setEditState({ loadingUpload: true })
      const { data } = await axios.post('/api/admin/upload', bodyFormData, {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      setEditState({ loadingUpload: false })
      setValue(imageField, data.secure_url)
      enqueueSnackbar('画像のアップロードが完了しました。', {
        variant: 'success',
      })
    } catch (err) {
      setEditState({ loadingUpload: false, errorUpload: getError(err) })
      enqueueSnackbar(getError(err), { variant: 'error' })
    }
  }

  const submitHandler = async ({
    name,
    slug,
    category,
    price,
    brand,
    countInStock,
    description,
  }) => {
    try {
      setEditState({ loadingUpdate: true })
      await axios.put(
        `/api/admin/products/${productId}`,
        {
          name,
          slug,
          category,
          price,
          brand,
          countInStock,
          description,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } },
      )
      setEditState({ loadingUpdate: false })
      enqueueSnackbar('商品の編集が完了しました。', { variant: 'success' })
    } catch (err) {
      setEditState({ loadingUpdate: false, errorUpdate: getError(err) })
      enqueueSnackbar(getError(err), { variant: error })
    }
  }

  useEffect(() => {
    if (_.isEmpty(userInfo)) {
      router.push('/login')
    }
    const fetchData = async () => {
      try {
        setEditState({ loading: true })
        const {
          data: {
            name,
            slug,
            category,
            price,
            brand,
            countInStock,
            description,
          },
        } = await axios.get(`/api/admin/products/${productId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        })
        setEditState({ loading: false })
        setValue('name', name)
        setValue('slug', slug)
        setValue('category', category)
        setValue('price', price)
        setValue('brand', brand)
        setValue('countInStock', countInStock)
        setValue('description', description)
      } catch (err) {
        setEditState({ loading: false, error: getError(err) })
      }
    }
    fetchData()
  }, [])

  return (
    <Layout title="Admin Dashboard">
      <Grid spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Admin Dashboard"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Orders"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem selected button component="a">
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
                <Typography component="h1" variant="h4">
                  Product Edit ${productId}
                </Typography>
              </ListItem>
              <ListItem>
                {loading && <CircularProgress />}
                {error && (
                  <Typography className={classes.error}>{error}</Typography>
                )}
              </ListItem>
              <ListItem>
                <form
                  onSubmit={handleSubmit(submitHandler)}
                  className={classes.form}
                >
                  <List>
                    <ListItem>
                      <Controller
                        control={control}
                        name="name"
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            label="name"
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors.name)}
                            helperText={errors.name ? 'Name is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        control={control}
                        name="slug"
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            label="Slug"
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors.slug)}
                            helperText={errors.slug ? 'slug is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        control={control}
                        name="category"
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            label="Categorty"
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors.category)}
                            helperText={
                              errors.category ? 'Category is required' : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    {/* <ListItem>
                      <Controller
                        control={control}
                        name="image"
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            label="Image"
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors.image)}
                            helperText={errors.image ? 'Image is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem> */}
                    {/* <ListItem>
                      <Button variant="contained" component="label">
                        Upload File
                        <input type="file" onChange={uploadHandler} hidden />
                      </Button>
                      {loadingUpdate && <CircularProgress />}
                    </ListItem> */}
                    <ListItem>
                      <Controller
                        control={control}
                        name="price"
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            label="Price"
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors.price)}
                            helperText={errors.price ? 'Price is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        control={control}
                        name="brand"
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            label="Brand"
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors.brand)}
                            helperText={errors.brand ? 'Brand is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Controller
                        control={control}
                        name="countInStock"
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            label="Count in Stock"
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors.countInStock)}
                            helperText={
                              errors.countInStock
                                ? 'Count in Stock is required'
                                : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        control={control}
                        name="description"
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors.description)}
                            helperText={
                              errors.description
                                ? 'Description is required'
                                : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                  </List>
                  <Button type="submit">send</Button>
                </form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  }
}
