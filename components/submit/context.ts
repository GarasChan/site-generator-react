import { UploadResponseData } from './../../pages/api/upload';
import { createContext } from 'react';

export interface SubmitData {
  id: string;
  data: Record<string, any>;
  content: string;
  filename: string;
}

export interface SubmitContextData {
  data: SubmitData | null;
  updateData: (val: SubmitData | null) => void;
  go: (step: number) => void;
}

const noop = () => {};

const SubmitContext = createContext<SubmitContextData>({
  data: null,
  go: noop,
  updateData: noop
});

export default SubmitContext;
