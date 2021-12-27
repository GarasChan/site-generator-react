import { AxiosRequestConfig } from 'axios';
import { useState, useEffect, useCallback } from 'react';
import request from '../utils/request';
import useRefCallback from './useRefCallback';

export interface UsePostData<T> {
  loading: boolean;
  data: T | null;
  error: Error | null;
  retry: () => void;
}

function useRequest<T>(config: AxiosRequestConfig): UsePostData<T> {
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const onError = useCallback((err: Error) => {
    setError(err);
    setResponseData(null);
    setLoading(false);
  }, []);

  const onSuccess = useCallback((data: T) => {
    setError(null);
    setResponseData(data);
    setLoading(false);
  }, []);

  const get = useRefCallback(() => {
    setLoading(true);
    request(config)
      .then((res) => {
        console.log('res.data', res.data);
        onSuccess(res.data);
      })
      .catch((err) => {
        onError(err);
      });
  });

  useEffect(() => {
    get();
  }, [get]);

  return {
    loading,
    data: responseData,
    error,
    retry: get
  };
}

export default useRequest;
