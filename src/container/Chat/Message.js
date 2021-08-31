import React from 'react';

let Message = (props) => {
  let {
    user,
    body,
  } = props;

  return (
    <p>
      {user.id} : {body}
    </p>
  )
}

export default Message;
