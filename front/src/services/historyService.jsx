import axios from 'axios'

export function createHistory(data) {
  return axios.post('/api/history', data)
}
export function updateHistory(id, data) {
  return axios.put(`/api/history/${id}`, data)
}
export function deleteHistory(id) {
  return axios.delete(`/api/history/${id}`)
}
export function findAllVested(userName, page, perPage) {
  return axios.get(
    `/api/history/findAllVested?user_name=${userName}&page=${page}&perPage=${perPage}`
  )
}
export function findAllWithdrawn(userName, page, perPage) {
  return axios.get(
    `/api/history/findAllWithdrawn?user_name=${userName}&page=${page}&perPage=${perPage}`
  )
}
export function findWithdrawnDetails(userName) {
  return axios.get(`findWithdrawnDetails?user_name=${userName}`)
}
export function findVestedDetails(userName) {
  return axios.get(`findVestedDetails?user_name=${userName}`)
}

export {}

/** @deprecated */
const HistoryService = {
  createHistory,
  updateHistory,
  deleteHistory,
  findAllVested,
  findAllWithdrawn,
  findWithdrawnDetails,
  findVestedDetails
}

export default HistoryService
