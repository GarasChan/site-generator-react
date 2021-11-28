import { Upload, message, Steps, Layout } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { ReactElement } from 'react';
import Main from '../../components/main';

const { Dragger } = Upload;
const { Step } = Steps;

const Submit = () => {
    const props = {
        name: 'file',
        multiple: true,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        onChange(info: { file: { name?: any; status?: any; }; fileList: any; }) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e: { dataTransfer: { files: any; }; }) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };
    return (
        <>
            <Layout.Sider theme="light">
                <Steps
                    current={0}
                    direction="vertical"
                    onChange={(current) => {
                        console.log('onChange:', current);
                    }}
                >
                    <Step title="上传文档" description="This is a description." />
                    <Step title="同步信息" description="This is a description." />
                    <Step title="提交" description="This is a description." />
                </Steps>
            </Layout.Sider>
            <Layout.Content>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibit from uploading company data or other band
                        files
                    </p>
                </Dragger>
            </Layout.Content>
        </>
    );
};

Submit.getLayout = function getLayout(page: ReactElement) {
    return <Main>{page}</Main>;
};

export default Submit;
