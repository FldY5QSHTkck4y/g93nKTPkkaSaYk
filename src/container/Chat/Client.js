import React, {
  useState,
  useEffect,
  useMemo,
} from 'react';
import { connect } from 'react-redux';

import API from '../../packages/GeofixAPI';
import ChatMessageAPI from '../../packages/GeofixAPI/messages';
import EmployeesAPI from '../../packages/GeofixAPI/employees';
import SocketClient from '../../packages/socketio';

import RoomList from './RoomList';

import {
  chatActions,
} from '../../store/actions';

/*
EVENT = {
    'test': 'test',
    'user-online': 'user-online',
    'new-user-message': 'new-user-message',
}
*/

let Client = (props) => {
  let {
    hasLogin,
    chatRooms, addChatRooms, setChatRooms,
    appendRoomIDData,
  } = props;

  let [socket, setSocket] = useState();
  let [connData, setConnData] = useState({});

  let [recipientDetail, setRecipientDetail] = useState({});
  let [recipients, setRecipients] = useState([]);
  let [message, setMessage] = useState('');

  let [userKeywords, setUserKeywords] = useState('');
  let [userOptions, setUserOptions] = useState([]);

  useEffect(() => {
    if (!hasLogin) {
      setConnData({});
      setSocket();
      return;
    }
    console.clear();

    ChatMessageAPI.getUserChatMessageID()
      .then(({ data }) => {
        console.log(data);
        setChatRooms(data.map(item => {
          return {
            id: item['message_id'],
          }
        }));
      })
      .catch(err => {
        console.error(err);
      });

    setSocket(() => SocketClient.connect('user'));

    return function cleanup() {
      socket && socket.disconnect();
      setSocket(null);
    }
  }, []);

  useEffect(() => {
    if (!socket) return;
    // console.log(socket);
    socket.on('connect', () => {
      console.log('connected to namespace');
      setConnData(() => ({
        id: socket.id,
      }));

      socket.emit(
        'user-online',
        {
          token: API.getUserToken(),
        },
        (ack) => {
          if (ack) {
            console.log('connection acknowledged');
          }
        }
      );
    });

    socket.on('user-online', (data) => {
      console.log('user-online', data);
    });
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on('new-user-message', (data) => {
      console.log('woah', data);
      addChatRooms({
        id: data['message_id']
      })
      appendRoomIDData({
        id: data['message_id'],
        data: data['message'],
      });
    });
  }, [socket]);

  useEffect(() => {
    if (!userKeywords) {
      return;
    }
    EmployeesAPI.getEmployeesByKeywords(userKeywords)
      .then(data => {
        console.log(data);
        setUserOptions(data || []);
      })
      .catch(err => {
        console.error(err);
      });
  }, [userKeywords]);

  let recipientCards = useMemo(() => {
    return recipients.map(id => recipientDetail[id]);
  }, [recipients, recipientDetail]);

  let testSubmit = (e) => {
    e.preventDefault();

    let payload = {
      token: API.getUserToken(),
      recipients: recipients,
      body: message,
    };
    // console.log(payload)
    // send message
    socket.emit(
      'new-user-message',
      payload,
      (ack) => {
        if (ack) {
          console.log('message sent');
        } else {
          console.log('nah');
        }
      }
    );
  }

  return (
    <div style={props.style}>
      {"recipients value" + JSON.stringify(recipients)}
      <form onSubmit={testSubmit}>
        {"Recipients :"}
        <input
          type="text"
          placeholder="recipients"
          value={recipients.join(',')}
          onChange={(e) => {
            let val = e.target.value;
            setRecipients(() => val.split(','))
          }}
        />
        <br />
        {"Add recipients"}
        <div
          style={{
            position: "relative",
            width: "15 em",
          }}
        >
          <input
            type="text"
            placeholder="search user..."
            value={userKeywords}
            onChange={(e) => {
              setUserKeywords(() => e.target.value);
            }}
            list="select"
          />
          <div
            style={{
              position: "absolute",
              top: '100%',
              backgroundColor: 'white',
              borderColor: '#1F1F1F',
            }}
          >
            {userOptions.map((item, idx) => (
              <p
                key={idx}
                onClick={() => {
                  let recipientSet = new Set(recipients);
                  recipientSet.add(item.user_id)
                  setRecipients([...recipientSet]);
                  setRecipientDetail({
                    ...recipientDetail,
                    [item.user_id]: item,
                  });
                  setUserOptions([]);
                }}
              >
                {item.username}
              </p>
            ))}
          </div>
        </div>
        <br />
        <br />
        {"Message"}
        <textarea
          value={message}
          onChange={(e) => {
            let val = e.target.value;
            setMessage(val);
          }}
        />
        <br />
        <input type="submit" />
      </form>
      {"value recipient"}
      {recipientCards.map(item => (
        <p>{JSON.stringify(item)}</p>
      ))}
      <RoomList rooms={chatRooms} />
      {props.children}
    </div>
  )
};

const mapStateToProps = (state) => ({
  hasLogin: state.user.hasLogin,
  claims: state.user.claims,
  chatRooms: state.chat.rooms,
});

const mapDispatchToProps = {
  addChatRooms: chatActions.addRooms,
  appendRoomIDData: chatActions.appendRoomIDData,
  setChatRooms: chatActions.setRooms,
};

Client = connect(mapStateToProps, mapDispatchToProps) (Client);

export default Client;
