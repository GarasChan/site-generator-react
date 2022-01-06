import axios from 'axios';

const request = axios.create({
  baseURL: '/api'
});

request.interceptors.response.use((res) => res.data);

export { request };
