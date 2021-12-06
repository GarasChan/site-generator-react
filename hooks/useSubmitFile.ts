import axios from 'axios';
import useSWR from 'swr';

const fetcher = (url: string, data: any) => axios.post(url, data).then((res) => res.data);

const useSubmitFile = (name: string, meta: Record<string, any>, content: string) => {
  const { data, error } = useSWR([`/api/update?name=${name}`, { data: meta, content }], fetcher);

  return {
    data,
    loading: !error && !data,
    error
  };
};

export default useSubmitFile;
