import axios from 'axios';

const token = localStorage.getItem('token');
axios.defaults.headers.common['Authorization'] = token;