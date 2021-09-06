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
    case 'REMOVE_ROOM':
      let newRoomData = {...state.roomData};
      delete newRoomData[payload];
      return {
        ...state,
        rooms: state.rooms.filter(item => item['message_id'] !== payload),
        roomData: newRoomData,
      };
    case 'UPDATE_ROOMS':
      let newUpdatedRooms = state.rooms.map(item => {
        if (payload['message_id'] === item['message_id']) {
          return payload;
        }
        return item;
      });
      return {
        ...state,
        rooms: newUpdatedRooms,
      }
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
