import axios from 'axios';

const request = axios.create({
  baseURL: '/api'
});

// request.interceptors.request.use((req) => {
//   console.log(req);
//   return req;
// });

// request.interceptors.response.use((res) => {
//   if (res.status === 200) {
//     return res.data;
//   }
//   return res;
// });

export default request;
