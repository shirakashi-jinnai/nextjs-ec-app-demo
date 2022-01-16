import _ from 'lodash'
import Cookies from 'js-cookie'
import { createContext, useReducer } from 'react'
import { useRouter } from 'next/dist/client/router'
import axios from 'axios'

export const Store = createContext(null)
const initialState = {
  darkMode: false,
  cart: {
    cartItems: Cookies.get('cartItems')
      ? JSON.parse(Cookies.get('cartItems'))
      : {},
    shippingAddress: Cookies.get('shippingAddress')
      ? JSON.parse(Cookies.get('shippingAddress'))
      : {},
    paymentMethod: Cookies.get('paymentMethod')
      ? Cookies.get('paymentMethod')
      : '',
  },
  userInfo: Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : null,
}

export const useStore = () => {
  const router = useRouter()
  const [state, dispatch] = useReducer((state: any, data: any) => {
    return _.assign({}, state, data)
  }, initialState)

  const addToCartHandler = async (product: any) => {
    const { data } = await axios.get(`/api/products/${product._id}`)
    const existItem = _.find(
      state.cart.cartItems,
      (item) => item._id === product._id,
    )
    const quantity = existItem ? existItem.quantity + 1 : 1

    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock')
      return
    }

    dispatch({
      cart: {
        ...state.cart,
        cartItems: {
          ...state.cart.cartItems,
          [product._id]: { ...product, quantity },
        },
      },
    })
    Cookies.set(
      'cartItems',
      JSON.stringify({
        ...state.cart.cartItems,
        [product._id]: { ...product, quantity: 1 },
      }),
    )
    router.push('/cart')
  }

  return {
    state,
    dispatch,
    addToCartHandler,
  }
}
