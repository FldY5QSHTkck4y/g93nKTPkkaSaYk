import React, {
  useMemo,
} from 'react';
import { connect } from 'react-redux';

import Message from './Message';

let MessageList = (props) => {
  let {
    roomData,
    messageID,
  } = props;

  let messages = useMemo(
    () => roomData[messageID] || [],
    [messageID, roomData]
  );

  let messageList = messages.map(
    ({user, body}, idx) => <Message key={idx} user={user} body={body} />
  );
  return (
    <div>
      Messages List
      {messageList}
    </div>
  )
}

const mapStateToProps = (state) => ({
  roomData: state.chat.roomData,
});

MessageList = connect(mapStateToProps, {}) (MessageList);

export default MessageList;
