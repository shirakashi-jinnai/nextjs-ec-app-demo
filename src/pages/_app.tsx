import React from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { theme } from '../components/theme'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/styles'
import Layout from '../components/Layout'
import { Store, useStore } from '../utils/Store'
import { SnackbarProvider } from 'notistack'

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    jssStyles?.parentElement?.removeChild(jssStyles)
  }, [])

  return (
    <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <ThemeProvider theme={theme}>
        <Store.Provider value={useStore()}>
          <CssBaseline />
          <Component {...pageProps} />
        </Store.Provider>
      </ThemeProvider>
    </SnackbarProvider>
  )
}
