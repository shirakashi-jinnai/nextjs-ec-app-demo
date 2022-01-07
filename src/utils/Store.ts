import _ from 'lodash'
import Cookies from 'js-cookie'
import { createContext, useReducer } from 'react'

export const Store = createContext(null)
const initialState = {
  darkMode: false,
  cart: {
    cartItems: Cookies.get('cartItems')
      ? JSON.parse(Cookies.get('cartItems'))
      : {},
  },
}

export const useStore = () => {
  const [state, dispath] = useReducer((state: any, data: any) => {
    return _.assign({}, state, data)
  }, initialState)
  console.log('state', state)

  return {
    state,
    dispath,
  }
}

// function reducer(state, action) {
//   switch (action.type) {
//     case 'CART_ADD_ITEM': {
//       const newItem = action.payload
//       const existItem = state.cart.cartItems.find(
//         (item) => item._id === newItem.name,
//       )
//       const cartItems = existItem
//         ? state.cart.cartItems.map((item) =>
//             item.name === existItem.name ? newItem : item,
//           )
//         : [...state.cart.cartItems, newItem]
//       Cookies.set('cartItems', JSON.stringify(cartItems))
//       return { ...state, cart: { ...state.cart, cartItems } }
//     }
//   }
// }
