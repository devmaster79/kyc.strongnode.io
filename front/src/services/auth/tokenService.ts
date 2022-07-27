import axios from 'axios'

export function setToken(token: string | null) {
  if (token === null) {
    localStorage.removeItem('token')
  } else {
    localStorage.setItem('token', token)
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  }
}
