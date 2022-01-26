import { createContext } from 'react';

export interface SubmitData {
  id: string;
  meta: Record<string, any>;
  content: string;
  filename: string;
}

export interface SubmitContextData {
  data: SubmitData | null;
  updateData: (val: SubmitData | null) => void;
  go: (step: number) => void;
  isModify?: boolean;
}

const noop = () => {};

const SubmitContext = createContext<SubmitContextData>({
  data: null,
  go: noop,
  updateData: noop
});

export default SubmitContext;
