import React, { useState } from 'react';
import { Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';
import { Document, Packer, Paragraph, TextRun } from 'docx';

const CVHandler = () => {
  const [file, setFile] = useState(null);

  const handleChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      setFile(info.file.originFileObj);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleUpload = () => {
    if (file) {
      // Perform any additional logic if necessary
      console.log('File uploaded:', file);
    } else {
      message.warning('Please select a file first!');
    }
  };

  const exportToPDF = () => {
    if (!file) {
      message.warning('No file to export!');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const element = document.createElement('div');
      element.innerHTML = e.target.result;
      const opt = {
        margin: 1,
        filename: 'cv.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().from(element).set(opt).save();
    };
    reader.readAsText(file);
  };

  const exportToDOCX = () => {
    if (!file) {
      message.warning('No file to export!');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                children: [new TextRun(text)]
              }),
            ],
          },
        ],
      });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, 'cv.docx');
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <Upload
        name="file"
        accept=".pdf,.doc,.docx,.txt,.html"
        showUploadList={false}
        customRequest={({ file, onSuccess }) => {
          setTimeout(() => {
            onSuccess("ok");
          }, 0);
        }}
        onChange={handleChange}
      >
        <Button icon={<UploadOutlined />}>Select CV</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        style={{ marginTop: 16 }}
      >
        Upload CV
      </Button>
      <Button
        type="primary"
        onClick={exportToPDF}
        style={{ marginTop: 16 }}
      >
        Export CV to PDF
      </Button>
      <Button
        type="primary"
        onClick={exportToDOCX}
        style={{ marginTop: 16 }}
      >
        Export CV to DOCX
      </Button>
    </div>
  );
};

export default CVHandler;
