import Editor, { EditorProp } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

const MdEditor = (props: EditorProp) => {
  return <Editor {...props} />;
};

export default MdEditor;
