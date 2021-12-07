import { useCallback, useRef } from 'react';

function useRefCallback<T extends (...args: any[]) => any>(callback: T) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback((...args: any[]) => callbackRef.current(...args), []) as T;
}

export default useRefCallback;
