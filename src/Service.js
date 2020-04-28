import { default as axios } from './axios';
export class Service {
  getUsers(page, size) {
    const offset = (page - 1) * size;
    return axios.get(`${axios.defaults.baseURL}/users?offset=${offset}&limit=${size}`);
  }

  addUser(user) {
    return axios.post(`${axios.defaults.baseURL}/users`, user);
  }

  getUserInfo(userID) {
    return axios.get(`${axios.defaults.baseURL}/users/${userID}`);
  }

  updateUser(user) {
    return axios.put(`${axios.defaults.baseURL}/users/${user.user_id}`,user);
  }

  getTransactions(userID,date_from="1970-12-28T15%3A00%3A00Z",date_to="2020-12-28T15%3A10%3A00Z"){
    return axios.get(`${axios.defaults.baseURL}/users/${userID}/transactions?datetime_from=${date_from}&datetime_to=${date_to}`);
  }

  addTransaction(transaction){
    return axios.post(`${axios.defaults.baseURL}/users/${transaction.user_id}/recharge`,transaction);
  }
}
