import axios from 'axios';

const request = axios.create({
  baseURL: '/api'
});

request.interceptors.response.use((res) => res.data);
export default request;

export async function asyncRunSafe<T = any>(fn: Promise<T>): Promise<[any] | [null, T]> {
  try {
    const result = await fn;
    return [null, result];
  } catch (e) {
    return [e];
  }
}
