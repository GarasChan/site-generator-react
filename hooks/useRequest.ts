import { AxiosRequestConfig } from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { request } from '../utils/client';
import useRefCallback from './useRefCallback';

export interface UsePostData<S, E> {
  loading: boolean;
  data: S | null;
  error: E | null;
  retry: () => void;
  requestImmediately?: boolean;
}

function useRequest<S, E = any>(config: AxiosRequestConfig, requestImmediately = true): UsePostData<S, E> {
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState<S | null>(null);
  const [error, setError] = useState<E | null>(null);

  const onError = useCallback((err: E) => {
    setError(err);
    setResponseData(null);
    setLoading(false);
  }, []);

  const onSuccess = useCallback((data: S) => {
    setError(null);
    setResponseData(data);
    setLoading(false);
  }, []);

  const get = useRefCallback(() => {
    setLoading(true);
    request(config)
      .then((res) => {
        onSuccess(res as unknown as S);
      })
      .catch((err) => {
        onError(err.response.data);
      });
  });

  useEffect(() => {
    requestImmediately && get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    data: responseData,
    error,
    retry: get
  };
}

export default useRequest;
