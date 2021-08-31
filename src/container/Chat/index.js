import React from 'react';
import { connect } from 'react-redux';

// import API from '../../packages/GeofixAPI';
import Client from './Client';

let Chat = (props) => {
  let {
    hasLogin,
    claims,
  } = props;

  if (!hasLogin) {
    return null;
  }

  return (
    <div>
      Yes, Chat.
      <Client />
    </div>
  )
}

const mapStateToProps = (state) => ({
  hasLogin: state.user.hasLogin,
  claims: state.user.claims,
});

const mapDispatchToProps = {
};

Chat = connect(mapStateToProps, mapDispatchToProps) (Chat);

export default Chat;
