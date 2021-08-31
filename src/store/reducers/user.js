const initialState = {
  hasLogin: false,
  claims: null,
}

const reducer = (state=initialState, action) => {
  let {
    type,
    payload,
  } = action;

  switch(type) {
    case 'SET_CLAIMS':
      return {
        ...state,
        claims: payload,
      }
    case 'SET_LOGIN_STATE':
      return {
        ...state,
        hasLogin: payload,
      }
    default:
      return state;
  }
}

export default reducer;
