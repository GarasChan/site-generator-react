import { UploadResponseData } from './../../pages/api/upload';
import { createContext } from 'react';

export interface SubmitData extends UploadResponseData {
  id: string;
}

export interface SubmitContextData {
  data: SubmitData;
  updateData: (val: SubmitData) => void;
  goNext: () => void;
  goBack: () => void;
}

const noop = () => {};

export const DEFAULT_SUBMIT_DATA = { id: '', data: {}, content: '' };

const SubmitContext = createContext<SubmitContextData>({
  data: { ...DEFAULT_SUBMIT_DATA },
  goNext: noop,
  goBack: noop,
  updateData: (val: SubmitData) => {}
});

export default SubmitContext;
