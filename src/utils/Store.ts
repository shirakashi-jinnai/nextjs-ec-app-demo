import _ from 'lodash'
import { createContext, useReducer } from 'react'

export const Store = createContext(null)
const initialState = {
  darkMode: false,
}

export const useStore = () => {
  const [state, dispath] = useReducer((state: any, data: any) => {
    return _.assign({}, state, data)
  }, initialState)

  return {
    state,
    dispath,
  }
}
