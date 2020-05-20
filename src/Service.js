import { default as axios } from './axios';
export class Service {
  getUsers({ user_requisites, email, size }, page) {
    const offset = (page - 1) * size;
    const haveEmail = email ? `&email=${email}` : ''; 
    return axios.get(
      `${axios.defaults.baseURL}/users?user_requisites=${user_requisites}&offset=${offset}&limit=${size}${haveEmail}`
    );
  }

  addUser(user) {
    return axios.post(`${axios.defaults.baseURL}/users`, user);
  }

  getUserInfo(userID) {
    return axios.get(`${axios.defaults.baseURL}/users/${userID}`);
  }

  updateUser(user) {
    return axios.put(`${axios.defaults.baseURL}/users/${user.user_id}`, user);
  }

  getTransactions(
    userID,
    date_from,
    date_to
  ) {
    return axios.get(
      `${axios.defaults.baseURL}/users/${userID}/transactions?datetime_from=${date_from +":00Z"}&datetime_to=${date_to+":00Z"}`
    );
  }

  addTransaction(transaction) {
    return axios.post(
      `${axios.defaults.baseURL}/users/${transaction.user_id}/recharge`,
      transaction
    );
  }
}
