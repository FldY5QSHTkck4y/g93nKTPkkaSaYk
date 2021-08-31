import React, {
  useState,
} from 'react';
import { connect } from 'react-redux';

import API from '../../packages/GeofixAPI';

import {
  userActions,
} from '../../store/actions';

let Login = (props) => {
  let {
    style,
    hasLogin, setHasLogin,
    setClaims,
  } = props;

  let [email, setEmail] = useState('oscar@example.com');
  let [password, setPassword] = useState('secret ipsum');

  let handleLogin = (e) => {
    e.preventDefault()
    API.login(email, password)
      .then(({ data }) => {
        // store!
        setClaims(API.getTokenClaims());
        setHasLogin(API.hasUserLogin());
      })
      .catch(err => {
        console.error(err);
      });
  }

  if (hasLogin) {
    return null;
  }

  return (
    <div
      style={style}
    >
      <form onSubmit={ handleLogin }>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input type="submit" />
      </form>
    </div>
  )
};

const mapStateToProps = (state) => ({
  hasLogin: state.user.hasLogin,
  claims: state.user.claims,
});

const mapDispatchToProps = {
  setHasLogin: userActions.setHasLogin,
  setClaims: userActions.setClaims,
};

Login = connect(mapStateToProps, mapDispatchToProps) (Login);

export default Login;
