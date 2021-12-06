import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Button, Empty, Message, Modal } from '@arco-design/web-react';
import classNames from 'classnames';
import { default as MdEditor } from 'md-editor-rt';
import { IconLeft, IconRight } from '@arco-design/web-react/icon';
import SubmitContext from './context';
import 'md-editor-rt/lib/style.css';

enum EditorMode {
  preview = 'preview',
  edit = 'edit'
}

export interface EditorProps {
  hide?: boolean;
}

function isEmpty(text: string) {
  return text.trim() === '';
}

// https://github.com/imzbf/md-editor-rt
const Editor = (props: EditorProps) => {
  const { data, goNext, goBack, updateData } = useContext(SubmitContext);
  const { hide } = props;
  const [text, setText] = useState(data.content);
  const [mode, setMode] = useState(isEmpty(text) ? EditorMode.edit : EditorMode.preview);

  const handleChange = useCallback((val: string) => {
    setText(val);
  }, []);

  const edit = useCallback(() => {
    setMode(EditorMode.edit);
  }, []);

  const exit = useCallback(() => {
    if (data.content !== text) {
      Modal.confirm({
        title: '确认退出编辑',
        content: '退出会重置当前变更，是否继续?',
        okText: '继续',
        onOk: () => {
          setText(data.content);
          setMode(EditorMode.preview);
        }
      });
    } else {
      setMode(EditorMode.preview);
    }
  }, [data.content, text]);

  const save = useCallback(() => {
    setMode(EditorMode.preview);
    updateData({ ...data, content: text });
  }, [data, text, updateData]);

  const hadleNext = useCallback(() => {
    if (text.trim() === '') {
      Message.warning('文档内容为空，请输入内容后继续');
      setMode(EditorMode.edit);
      return;
    }
    goNext();
  }, [goNext, text]);

  useEffect(() => {
    if (data.content !== text) {
      setText(data.content);
      setMode(isEmpty(data.content) ? EditorMode.edit : EditorMode.preview);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.content]);

  return (
    <div style={{ position: 'relative' }} className={classNames({ hidden: hide })}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'flex-end' }}>
        {mode === EditorMode.preview ? (
          <>
            <Button style={{ marginRight: 'auto' }} onClick={goBack}>
              <IconLeft />
              <span>上一步</span>
            </Button>
            <Button onClick={edit}>编辑</Button>
            <Button style={{ marginLeft: 16 }} type="primary" onClick={hadleNext}>
              <span>下一步</span>
              <IconRight />
            </Button>
          </>
        ) : (
          <>
            <Button onClick={exit}>退出</Button>
            <Button style={{ marginLeft: 16 }} type="primary" onClick={save}>
              保存
            </Button>
          </>
        )}
      </div>
      {mode === EditorMode.edit ? (
        <MdEditor
          key={mode}
          style={{ height: 800 }}
          previewTheme="vuepress"
          modelValue={text}
          toolbarsExclude={['save', 'pageFullscreen', 'fullscreen', 'htmlPreview', 'github']}
          onChange={handleChange}
        />
      ) : isEmpty(text) ? (
        <Empty />
      ) : (
        <MdEditor key={mode} modelValue={text} previewOnly />
      )}
    </div>
  );
};

export default Editor;
