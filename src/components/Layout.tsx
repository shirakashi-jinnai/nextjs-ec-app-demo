import _ from 'lodash'
import React, { FC, useContext } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import {
  AppBar,
  Badge,
  Container,
  IconButton,
  Link,
  Switch,
  Toolbar,
  Typography,
} from '@mui/material'
import { makeStyles, ThemeProvider } from '@mui/styles'
import { Store } from '../utils/Store'
import { theme } from './theme'

type Layout = {
  title?: string
  description?: string
  children: any
}

const useStyles = makeStyles({
  navBar: {
    backgroundColor: '#203040',
    '& a': {
      color: '#fff',
      marginLeft: 10,
    },
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  grow: {
    flexGrow: 1,
  },
  main: {
    minHeight: '80vh',
  },
  footer: {
    textAlign: 'center',
    marginTop: 10,
  },
})

const Layout: FC<Layout> = ({ title, children, description }) => {
  const classes = useStyles()
  const { state } = useContext(Store)
  const { cart } = state

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
              <NextLink href="/login" passHref>
                <Link>Login</Link>
              </NextLink>
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
