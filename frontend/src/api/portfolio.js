import axios from "axios";

const API = "http://localhost:3000";

export const getPortfolio = (id) =>
  axios.get(`${API}/portfolio/${id}`).then(r => r.data);

export const updatePortfolio = (id, data) =>
  axios.put(`${API}/portfolio/${id}`, data).then(r => r.data);

export const deletePortfolio = (id) =>
  axios.delete(`${API}/portfolio/${id}`).then(r => r.data);