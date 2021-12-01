import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Button, Space, Divider } from '@arco-design/web-react';
import classnames from 'classnames';
import { default as MdEditor } from 'md-editor-rt';
import { ResponseData } from '../../pages/api/upload';
import 'md-editor-rt/lib/style.css';

enum EditorMode {
  preview = 'preview',
  edit = 'edit'
}

export interface EditorProps {
  value: string;
  updateContent: (val: string) => void;
}

// https://github.com/imzbf/md-editor-rt
const Editor = (props: EditorProps) => {
  const { value, updateContent } = props;
  const [mode, setMode] = useState(EditorMode.preview);

  const changeMode = () => {
    setMode(mode === EditorMode.preview ? EditorMode.edit : EditorMode.preview);
  };

  const handleChange = (val: string) => {
    updateContent(val);
  };

  return (
    <>
      <Divider />
      <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={changeMode}>{mode === EditorMode.preview ? '编辑' : '保存'}</Button>
      </Space>
      <Divider />
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
        toolbarsExclude={['save', 'pageFullscreen', 'fullscreen', 'htmlPreview', 'github']}
        onChange={handleChange}
      />
    </>
  );
};

export default Editor;
