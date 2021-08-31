import React, {
  useEffect,
} from 'react';
import {
  connect,
} from 'react-redux';

import API from './packages/GeofixAPI';
import Login from './container/Login';
import Chat from './container/Chat';
import {
  userActions,
} from './store/actions';

let App = (props) => {
  let {
    setHasLogin,
    claims, setClaims,
  } = props;

  useEffect(() => {
    try {
      API.refreshToken();
      if (API.hasUserLogin()) {
        // set user claims to store
        setClaims(API.getTokenClaims());
        setHasLogin(API.hasUserLogin());
      }
    } catch (e) {
    }
  }, []);

  return (
    <div className="App">
      {/* dev section */}
      <div>
        <h1>DEV</h1>
        <h2>USER {claims && JSON.stringify(claims.id) || ''}</h2>
        <button
          onClick={() => API.showCookie()}
        >
          Cookie
        </button>
        <button
          onClick={() => API.showClaims()}
        >
          Claims
        </button>
        <button
          onClick={() => {
            API.logout()
            setHasLogin(false);
          }}
        >
          Logout
        </button>
      </div>

      {/* chat app section */}
      <Login />
      <Chat />
    </div>
  );
}

const mapStateToProps = (state) => ({
  claims: state.user.claims,
});
const mapDispatchToProps = {
  setClaims: userActions.setClaims,
  setHasLogin: userActions.setHasLogin,
};

App = connect(mapStateToProps, mapDispatchToProps) (App);

export default App;
