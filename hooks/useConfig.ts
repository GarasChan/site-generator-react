import axios from 'axios';
import useSWR from 'swr';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const useConfig = () => {
  const { data, error } = useSWR('/api/config', fetcher);

  return {
    config: data || {},
    loading: !error && !data,
    error
  };
};

export default useConfig;
