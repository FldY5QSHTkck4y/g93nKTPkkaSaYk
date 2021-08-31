// {id: msg_id<int, latest_activity_time: <ISO8601>}
export const addRooms = (roomObj) => ({
  type: 'ADD_ROOMS',
  payload: roomObj,
});

export const setRoomData = (payload) => ({
  type: 'SET_ROOM_DATA',
  payload: payload,
});

// {id: msg_id<int>, data: {user: <obj>, body: <str>}
export const appendRoomIDData = (payload) => ({
  type: 'APPEND_ROOMID_DATA',
  payload: payload,
});

export const setRooms = (payload) => ({
  type: 'SET_ROOMS',
  payload: [...payload],
});
