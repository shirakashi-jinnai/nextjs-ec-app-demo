import React, { FC } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import {
  AppBar,
  Container,
  IconButton,
  Link,
  Switch,
  Toolbar,
  Typography,
} from '@mui/material'
import { makeStyles } from '@mui/styles'

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
  return (
    <div>
      <Head>
        <title>{title ? `${title} - Next Amazona` : 'Next Amazona'}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        {description && <meta name="description" content={description} />}
      </Head>
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
              <Link>Cart</Link>
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
    </div>
  )
}

export default Layout
