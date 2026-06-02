import { Upload, message } from 'antd';
import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import './ImageUploader.css';

const { Dragger } = Upload;

export default function ImageUploader({ value, onChange, label = '上传图片', hint = '支持 JPG/PNG 格式' }) {
  const [preview, setPreview] = useState(value || null);

  const handleBeforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('请上传图片文件');
      return false;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      onChange?.(e.target.result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target.result);
          onChange?.(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  if (preview) {
    return (
      <div className="image-uploader-preview" onPaste={handlePaste} tabIndex={0}>
        <img src={preview} alt="preview" className="preview-image" />
        <div className="preview-overlay">
          <Upload beforeUpload={handleBeforeUpload} showUploadList={false}>
            <a>重新上传</a>
          </Upload>
          <a onClick={() => { setPreview(null); onChange?.(null); }}>删除</a>
        </div>
      </div>
    );
  }

  return (
    <div onPaste={handlePaste} tabIndex={0}>
      <Dragger
        beforeUpload={handleBeforeUpload}
        showUploadList={false}
        multiple={false}
        className="image-uploader-dragger"
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ fontSize: 40, color: '#1677ff' }} />
        </p>
        <p className="ant-upload-text">{label}</p>
        <p className="ant-upload-hint">{hint}，拖拽或点击上传，也可 Ctrl+V 粘贴</p>
      </Dragger>
    </div>
  );
}
