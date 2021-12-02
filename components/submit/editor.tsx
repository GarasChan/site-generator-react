import React, { useState } from 'react';
import { Button } from '@arco-design/web-react';
import classnames from 'classnames';
import { default as MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import classNames from 'classnames';

enum EditorMode {
  preview = 'preview',
  edit = 'edit'
}

export interface EditorProps {
  value: string;
  updateContent: (val: string) => void;
  hide?: boolean;
}

// https://github.com/imzbf/md-editor-rt
const Editor = (props: EditorProps) => {
  const { value, updateContent, hide } = props;
  const [mode, setMode] = useState(EditorMode.preview);

  const handleChange = (val: string) => {
    updateContent(val);
  };

  const edit = () => {
    setMode(EditorMode.edit);
  };

  const preview = () => {
    setMode(EditorMode.preview);
  };

  return (
    <div style={{ position: 'relative' }} className={classNames({ hidden: hide })}>
      <MdEditor
        editorClass={classnames({ hidden: mode !== EditorMode.preview })}
        editorId="preview"
        modelValue={value}
        previewOnly
      />
      <MdEditor
        editorId="edit"
        editorClass={classnames({ hidden: mode === EditorMode.preview })}
        style={{ height: 800 }}
        previewTheme="vuepress"
        modelValue={value}
        toolbarsExclude={['pageFullscreen', 'fullscreen', 'htmlPreview', 'github']}
        onChange={handleChange}
        onSave={preview}
      />
      {mode === EditorMode.preview && (
        <Button style={{ position: 'absolute', right: 24, top: 24 }} shape="round" type="primary" onClick={edit}>
          编辑
        </Button>
      )}
    </div>
  );
};

export default Editor;
