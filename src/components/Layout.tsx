import _ from 'lodash'
import React, { FC, useContext, useState } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import {
  AppBar,
  Badge,
  Button,
  Container,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Switch,
  Toolbar,
  Typography,
} from '@mui/material'
import { ThemeProvider } from '@mui/styles'
import { Store } from '../utils/Store'
import { theme } from './theme'
import useStyles from '../utils/styles'
import Cookies from 'js-cookie'
import { useRouter } from 'next/dist/client/router'

type Layout = {
  title?: string
  description?: string
  children: any
}

const Layout: FC<Layout> = ({ title, children, description }) => {
  const classes = useStyles()
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const { cart, userInfo } = state

  const [anchorEl, setAnchorEl] = useState(null)
  const loginClickHandler = (e) => setAnchorEl(e.currentTarget)
  const loginMenuCloseHandler = () => setAnchorEl(null)
  const logoutClickHandler = () => {
    setAnchorEl(null)
    dispatch({ userInfo: null, cart: { cartItems: {} } })
    Cookies.remove('cartItems')
    Cookies.remove('userInfo')
    router.push('/')
  }

  return (
    <div>
      <Head>
        <title>{title ? `${title} - Next Amazona` : 'Next Amazona'}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        {description && <meta name="description" content={description} />}
      </Head>
      <ThemeProvider theme={theme}>
        <AppBar
          position="static"
          className={classes.navBar}
          style={{ background: '#203040' }}
        >
          <Toolbar>
            <NextLink href="/" passHref>
              <Link>
                <Typography className={classes.brand}>Amazona</Typography>
              </Link>
            </NextLink>
            <div className={classes.grow}></div>
            <div>
              <Switch></Switch>
              <NextLink href="/cart" passHref>
                <Link>
                  {_.size(cart.cartItems) > 0 ? (
                    <Badge
                      color="secondary"
                      badgeContent={_.size(cart.cartItems)}
                    >
                      Cart
                    </Badge>
                  ) : (
                    'Cart'
                  )}
                </Link>
              </NextLink>
              {userInfo ? (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                    className={classes.navbarButton}
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    keepMounted
                    onClose={loginMenuCloseHandler}
                  >
                    <MenuItem onClick={loginMenuCloseHandler}>Profile</MenuItem>
                    <MenuItem onClick={loginMenuCloseHandler}>
                      My account
                    </MenuItem>
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href="/login" passHref>
                  <Link>Login</Link>
                </NextLink>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          <Typography>All rights reserved. Next Amazona</Typography>
        </footer>
      </ThemeProvider>
    </div>
  )
}

export default Layout
