import React, {
  useEffect,
  useState,
} from 'react';
import { connect } from 'react-redux';

import MessageList from './MessageList';
import RecipientList from './RecipientList';
import SearchUser from './SearchUser';
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
    room, // id recipients title last_message
    updateRooms,
  } = props;

  let [socket, setSocket] = useState();
  let [chat, setChat] = useState('');

  let [additionalUser, setAdditionalUser] = useState([]);

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

  useEffect(() => {
    if (!socket) return;
    socket.on('add-recipient', (data) => {
      let newRoom = {
        ...room,
      };
      newRoom.recipients.push(...data.recipients);
      console.log(data, 'add recipient');
      updateRooms(newRoom);
    });
  }, [socket]);

  useEffect(() => {
    if(!socket) return;
    socket.on('remove-recipient', (data) => {
      console.log(data, 'remove-recipient');
      let newRoom = {
        ...room,
      };
      let newRecipients = [...room.recipients]
      newRecipients = newRecipients.filter(
        item => !(data.recipients.includes(item.id))
      );
      newRoom.recipients = newRecipients;
      updateRooms(newRoom);
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

  let addUser = (e) => {
    e.preventDefault();
    let payload = {
      'token': API.getUserToken(),
      'message_id': messageID,
      'recipients': additionalUser,
    }
    console.log(payload);
    socket.emit(
      'add-recipient',
      payload,
      (ack) => {
        console.log(ack, 'ack');
        setAdditionalUser([]);
      }
    );
  }

  let removeRecipient = (recipient) => {
    let payload = {
      'token': API.getUserToken(),
      'message_id': messageID,
      'recipients': [recipient.id],
    }
    console.log(payload);
    socket.emit(
      'remove-recipient',
      payload,
      (ack) => {
        if (ack) { console.log('sent'); };
      },
    )
  }

  return (
    <div>
      <h2>Message ID: {messageID}</h2>
      <h3>Title: {room['title'] || JSON.stringify(room['title'])}</h3>
      <p>Owner: {JSON.stringify(room['owner'])}</p>
      <p>Recipients</p>
      <RecipientList
        recipients={room['recipients']}
        removeRecipient={removeRecipient}
      />
      {"add recipient"}
      <p>New rec: {JSON.stringify(additionalUser)}</p>
      <form
        onSubmit={addUser}
      >
        <SearchUser
          onSelectUser={(user) => {
            console.log(user);
            setAdditionalUser([
              ...additionalUser,
              user['user_id'],
            ]);
            /*
            {
              "user_id": 2,
              "username": "leleyeye",
              "email": "lele@example.com",
              "first_name": "Lele",
              "last_name": "Yeye",
              "company_name": "Geofix Indonesia"
            }
            */
          }}
        />
        <input type="submit" value="add new recipient" />
      </form>
      {/*
      <form onSubmit={submitChat}>
        <textarea
          value={chat}
          onChange={(e) => setChat(e.target.value)}
        />
        <input type="submit" value=">>"/>
      </form>
      <MessageList messageID={messageID} />
      */}
    </div>
  )
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = {
  appendRoomIDData: chatActions.appendRoomIDData,
  updateRooms: chatActions.updateRooms,
};

Room = connect(mapStateToProps, mapDispatchToProps) (Room);

export default Room;
