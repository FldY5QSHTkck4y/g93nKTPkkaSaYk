import API from './index';
import axios from '../axios';

import {
  BASE_API_URL,
} from '../../helpers/envMap';

class Messages extends API {
  static getUserChatMessageID() {
    return axios({
      method: 'GET',
      url: `${BASE_API_URL}/geofix/chat`,
    });
  }

  static getUserChatMessageIDDetail(messageID=null) {
    return axios({
      method: 'GET',
      url: `${BASE_API_URL}/geofix/chat/${messageID}`
    });
  }
}

export default Messages;
