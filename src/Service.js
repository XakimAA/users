import { default as axios } from './axios';
export class Service {
  getUsers(page, size) {
    const offset = (page-1)*size;
    return axios.get(`${axios.defaults.baseURL}/users?offset=${offset}&limit=${size}`);
  }
  addUser(user) {
    return axios.post(`${axios.defaults.baseURL}/users`, user);
  }

  getUserInfo(userID){
    return axios.get(`${axios.defaults.baseURL}/users/${userID}`);
  }
}

