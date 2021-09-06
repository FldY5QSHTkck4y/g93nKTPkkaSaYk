import React from 'react';

let Recipient = (props) => {
  let {
    recipient,
    removeRecipient,
  } = props;

  let handleClick = (e) => {
    e.preventDefault();
    // console.log(recipient);
    removeRecipient(recipient);
  }

  if (!recipient) return;
  return (
    <div>
      {JSON.stringify(recipient)}
      <button
        onClick={handleClick}
      >
        Remove Me
      </button>
    </div>
  )
}

export default Recipient;
