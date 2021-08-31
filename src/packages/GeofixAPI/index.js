import jwt from 'jsonwebtoken';

import axiosRequest from 'axios';
import cookies, { cookieOpt } from '../cookies';
import {
  BASE_API_URL,
  JWT_SECRET_KEY,
} from '../../helpers/envMap';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Geofix API consumer
class API {
  static getCookies(key=null) {
    if (!key) {
      return cookies.getAll();
    } else {
      return cookies.get(key);
    }
  }

  static setCookies(key=null, val=null) {
    if (!key) {
      return;
    }
    cookies.set(key, val, cookieOpt);
  }

  static showCookie() {
    console.log(API.getCookies());
  }

  static getTokenClaims() {
    let token = API.getCookies(ACCESS_TOKEN_KEY);
    if (!token) {
      return token;
    }
    let decoded = jwt.decode(token, JWT_SECRET_KEY);
    return decoded;
  }

  static getUserToken() {
    return API.getCookies(ACCESS_TOKEN_KEY);
  }

  static showClaims() {
    console.log(API.getTokenClaims());
  }

  static login(email, password) {
    return axiosRequest({
      method: 'POST',
      url: `${BASE_API_URL}/users`,
      data: {
        email,
        password,
      },
    })
      .then((result) => {
        let { data } = result;
        API.setCookies(ACCESS_TOKEN_KEY, data['access_token']);
        API.setCookies(REFRESH_TOKEN_KEY, data['refresh_token']);
        return result;
      })
  }

  static logout() {
    cookies.remove(ACCESS_TOKEN_KEY);
    cookies.remove(REFRESH_TOKEN_KEY);
    return true;
  }

  static refreshToken() {
    let refreshToken = API.getCookies(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error('refresh token not found');
    }
    axiosRequest({
      method: 'get',
      url: `${BASE_API_URL}/refresh`,
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
      },
    })
      .then((result) => {
        let { data } = result;
        API.setCookies(ACCESS_TOKEN_KEY, data['access_token']);
        API.setCookies(REFRESH_TOKEN_KEY, data['refresh_token']);
        console.log('token refreshed');
      })
      .catch((err) => {
        // should handle no connection instead of logging out
        // API.logout();
        console.error(err);
      });
  }

  static hasUserLogin() {
    return !!API.getTokenClaims();
  }
}

export default API;
