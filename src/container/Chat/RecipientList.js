import React from 'react';

import Recipient from './Recipient';

let RecipientList = (props) => {
  let {
    recipients,
    removeRecipient,
  } = props;

  if (!recipients) return;
  return recipients.map(item => (
    <Recipient
      recipient={item}
      removeRecipient={removeRecipient}
    />
  ));
}

export default RecipientList;
