import React from 'react';

import Room from './Room';

let RoomList = (props) => {
  let {
    rooms,
  } = props;

  let roomList = rooms.map((roomObj, idx) => (
    <Room key={idx} messageID={roomObj.id} room={roomObj} />
  ))

  return roomList;
}

export default RoomList;
