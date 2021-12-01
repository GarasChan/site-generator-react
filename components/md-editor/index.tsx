import Editor, { EditorProp } from 'md-editor-rt';
import { useState } from 'react';
import 'md-editor-rt/lib/style.css';

export interface MdEditorProps extends Omit<EditorProp, 'modelValue' | 'onChange'> {
  defaultValue: string;
}

const MdEditor = (props: MdEditorProps) => {
  const { defaultValue, ...rest } = props;
  const [text, setText] = useState(defaultValue);

  const handleChange = (val: string) => {
    setText(val);
  };

  return <Editor {...rest} modelValue={text} onChange={handleChange} />;
};

export default MdEditor;
