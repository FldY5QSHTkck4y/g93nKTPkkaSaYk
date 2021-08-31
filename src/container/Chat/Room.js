import React, {
  useEffect,
  useState,
} from 'react';
import { connect } from 'react-redux';

import MessageList from './MessageList';
import API from '../../packages/GeofixAPI';
import ChatMessageAPI from '../../packages/GeofixAPI/messages';
import SocketClient from '../../packages/socketio';
import {
  chatActions,
} from '../../store/actions';

let Room = (props) => {
  let {
    messageID,
    appendRoomIDData,
  } = props;

  let [socket, setSocket] = useState();
  let [chat, setChat] = useState('');

  useEffect(() => {
    setSocket(() => SocketClient.connect('chat'));

    ChatMessageAPI.getUserChatMessageIDDetail(messageID)
      .then(({ data }) => {
        console.log(data);
        data.forEach(item => {
          appendRoomIDData({
            id: messageID,
            data: item,
          });
        });
      })
      .catch(err => {
        console.error(err);
      });
    return () => {
      socket && socket.disconnect();
      setSocket(null);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      socket.emit(
        'listen-message',
        {
          token: API.getUserToken(),
          'message_id': messageID,
        },
        (ack) => {
          if (ack) {
            console.log('connected to rooms');
          }
        },
      );
    });
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on('append-message', (data) => {
      console.log(data);
      appendRoomIDData({
        id: messageID,
        data: data,
      });
    });
  }, [socket]);

  let submitChat = (e) => {
    e.preventDefault();
    if (!socket) return;
    socket.emit(
      'append-message',
      {
        token: API.getUserToken(),
        'message_id': messageID,
        body: chat,
      },
      (ack) => {
        if (ack) { console.log('sent'); }
      },
    );
  }

  return (
    <div>
      <p>Message ID: {messageID}</p>
      <form onSubmit={submitChat}>
        <textarea
          value={chat}
          onChange={(e) => setChat(e.target.value)}
        />
        <input type="submit" value=">>"/>
      </form>
      <MessageList messageID={messageID} />
    </div>
  )
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = {
  appendRoomIDData: chatActions.appendRoomIDData,
};

Room = connect(mapStateToProps, mapDispatchToProps) (Room);

export default Room;
