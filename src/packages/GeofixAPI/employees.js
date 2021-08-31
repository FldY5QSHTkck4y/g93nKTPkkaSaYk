import API from './index';
import axios from '../axios';

import {
  BASE_API_URL,
} from '../../helpers/envMap';

class Employees extends API {
  static getEmployeesByKeywords(keywords='') {
    return axios({
      method: 'GET',
      url: `${BASE_API_URL}/employees`,
      params: {
        keywords: keywords,
      },
    })
      .then(resp => {
        return resp['data']['data']
      });
  }
}

export default Employees;
