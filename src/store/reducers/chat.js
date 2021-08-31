const initialState = {
  rooms: [],
  roomData: {},
}

const reducer = (state=initialState, action) => {
  let {
    type,
    payload,
  } = action;

  switch(type) {
    case 'ADD_ROOMS':
      return {
        ...state,
        rooms: [
          ...state.rooms,
          payload,
        ],
      }
    case 'APPEND_ROOMID_DATA':
      let {
        id,
        data,
      } = payload;
      let roomData = state.roomData[id] ?
        [...state.roomData[id]] :
        [];
      let stateRoomData;
      roomData.push(data);
      stateRoomData = {
        ...state.roomData
      }
      stateRoomData[id] = roomData;
      return {
        ...state,
        roomData: {
          ...stateRoomData,
        },
      }
    case 'SET_ROOMS':
      return {
        ...state,
        rooms: payload,
      }
    case 'SET_ROOM_DATA':
      return {
        ...state,
        roomData: payload,
      }
    default:
      return state;
  }
}

export default reducer;
