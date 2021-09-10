import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutations-types'

export default {
  [ADD_COUNTER](state,payload) {
    payload.count = payload.count+1
  },
  [ADD_TO_CART](state,payload) {
    payload.checked = true
    payload.count = 1
    state.cartList.push(payload)
  }
}
