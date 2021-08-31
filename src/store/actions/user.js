export const setHasLogin = (payload) => ({
  type: 'SET_LOGIN_STATE',
  payload: !!payload,
})

export const setClaims = (payload) => ({
  type: 'SET_CLAIMS',
  payload: payload,
});
