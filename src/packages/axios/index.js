/**
 * Axios instance with automatic token refresh interceptor to token API
 * References
 * https://medium.com/swlh/handling-access-and-refresh-tokens-using-axios-interceptors-3970b601a5da
 */
import axios from 'axios';
// import Cookies from 'universal-cookie';
import {
    BASE_API_URL,
} from '../../helpers/envMap';
import cookies from '../cookies';
import { cookieOpt } from '../cookies';

/*
const cookies = new Cookies();
const cookieOpt = {
    path: '/',
};
*/
const instance = axios.create();

instance.interceptors.request.use(
    (config) => {
        // use interceptor to set access token before sending request
        let accessToken = cookies.get('accessToken');
        // let refreshToken = cookies.get('refreshToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        };
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        let originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            let refreshToken = cookies.get('refreshToken');
            originalRequest._retry = true;
            return axios({
                method: 'get',
                url: `${BASE_API_URL}/refresh`,
                headers: {
                    'Authorization': `Bearer ${refreshToken}`,
                },
            })
                .then(res => {
                    if (res.status === 200) {
                        let accessToken = res.data['access_token'];
                        let refreshToken = res.data['refresh_token'];
                        // put token in cookie
                        cookies.set('accessToken', accessToken, cookieOpt);
                        cookies.set('refreshToken', refreshToken, cookieOpt);
                        // change auth header
                        instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                        // return original request object with axios
                        return instance(originalRequest);
                    };
                })
        }
        return Promise.reject(error);
    },
);

export const getInstance = () => {
    const instance = axios.create();

    instance.interceptors.request.use(
        (config) => {
            // use interceptor to set access token before sending request
            let accessToken = cookies.get('accessToken');
            // let refreshToken = cookies.get('refreshToken');
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            };
            return config;
        },
        (error) => {
            return Promise.reject(error);
        },
    );

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            let originalRequest = error.config;
            if (error.response.status === 401 && !originalRequest._retry) {
                let refreshToken = cookies.get('refreshToken');
                originalRequest._retry = true;
                return axios({
                    method: 'get',
                    url: `${BASE_API_URL}/refresh`,
                    headers: {
                        'Authorization': `Bearer ${refreshToken}`,
                    },
                })
                    .then(res => {
                        if (res.status === 200) {
                            let accessToken = res.data['access_token'];
                            let refreshToken = res.data['refresh_token'];
                            // put token in cookie
                            cookies.set('accessToken', accessToken, cookieOpt);
                            cookies.set('refreshToken', refreshToken, cookieOpt);
                            // change auth header
                            instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                            // return original request object with axios
                            return instance(originalRequest);
                        };
                    })
            }
            return Promise.reject(error);
        },
    );
    return instance;
}

export default instance;
