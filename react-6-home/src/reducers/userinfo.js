import * as actionsTypes from '../constants/userinfo'

export default function userinfo(state = {}, action) {
  switch (action.type) {
    case actionsTypes.USERINFO_UPDATE:
      return action.data
    default:
      return state
  }
}