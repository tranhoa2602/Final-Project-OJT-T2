import React, { useEffect, useState } from "react";
import { Button, Form, Input, Typography, message, Switch, Select, Upload } from "antd";
import axios from "axios";
import { firebaseConfig } from "../../../firebaseConfig";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UploadOutlined } from '@ant-design/icons';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const { Title } = Typography;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const EditTech = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [existingTypes, setExistingTypes] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchTech = async () => {
      try {
        const response = await axios.get(
          `${firebaseConfig.databaseURL}/technologies/${id}.json`
        );
        const data = response.data;
        data.techstatus = data.techstatus === "Active";
        data.deletestatus = data.deletestatus !== undefined ? data.deletestatus : false;
        setInitialValues(data);
        form.setFieldsValue(data);
        if (data.imageUrls) {
          setFileList(data.imageUrls.map(url => ({
            uid: url,
            name: url.split('/').pop(),
            url
          })));
        }
      } catch (error) {
        console.error(t("Error fetching technology:"), error);
        message.error(t("Failed to fetch technology."));
      }
    };

    const fetchExistingTypes = async () => {
      try {
        const response = await axios.get(`${firebaseConfig.databaseURL}/technologies.json`);
        const types = response.data
          ? Object.values(response.data).map(tech => tech.techtype).flat()
          : [];
        setExistingTypes([...new Set(types)]);
      } catch (error) {
        console.error("Error fetching existing types: ", error);
      }
    };

    fetchTech();
    fetchExistingTypes();
  }, [id, form, t]);

  const handleUpload = async () => {
    const storage = getStorage();
    const uploadPromises = fileList.map(file => {
      if (file.url) return Promise.resolve(file.url); // Skip URLs that are already in storage
      const storageRef = ref(storage, `techimage/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file.originFileObj);

      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          null,
          error => reject(error),
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
          }
        );
      });
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (values) => {
    try {
      values.techstatus = values.techstatus ? "Active" : "Inactive";
      values.deletestatus = false;

      const imageUrls = await handleUpload();

      if (imageUrls.length > 0) {
        values.imageUrls = imageUrls;

        await axios.put(
          `${firebaseConfig.databaseURL}/technologies/${id}.json`,
          values
        );

        message.success(t("Technology updated successfully!"));
        navigate("/TechList");
      } else {
        message.error(t("No images were uploaded."));
      }
    } catch (error) {
      console.error(t("Error updating technology:"), error);
      message.error(t("Failed to update technology."));
    }
  };

  const handleFailure = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const validateDescription = (_, value) => {
    const wordCount = value ? value.split(' ').filter(word => word).length : 0;
    return wordCount <= 20 ? Promise.resolve() : Promise.reject(new Error(t("Description cannot exceed 20 words")));
  };

  if (!initialValues) {
    return <div>Loading...</div>;
  }

  return (
    <Form
      {...formItemLayout}
      form={form}
      onFinish={handleSubmit}
      onFinishFailed={handleFailure}
      style={{ height: "100vh" }}
      initialValues={initialValues}
    >
      <Title level={2}>{t("Edit Technology")}</Title>
      <Form.Item
        label={t("Tech Name")}
        name="techname"
        rules={[{ required: true, message: t("Please input Tech Name!") }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={t("Tech Type")}
        name="techtype"
        rules={[{ required: true, message: t("Please input Tech Type!") }]}
      >
        <Select
          mode="tags"
          style={{ width: "100%" }}
          placeholder={t("Tags Mode")}
          options={existingTypes.map(type => ({ value: type }))}
        />
      </Form.Item>
      <Form.Item
        label={t("Tech Status")}
        name="techstatus"
        valuePropName="checked"
        rules={[{ required: true, message: t("Please select Tech Status!") }]}
      >
        <Switch checkedChildren={t("Active")} unCheckedChildren={t("Inactive")} />
      </Form.Item>
      <Form.Item
        label={t("Tech Description")}
        name="techdescription"
        rules={[{ validator: validateDescription }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={t("Upload Images")}
        name="techimages"
      >
        <Upload
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
          beforeUpload={() => false} // Prevent automatic upload
          listType="picture"
          multiple
        >
          <Button icon={<UploadOutlined />}>{t("Select Images")}</Button>
        </Upload>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" htmlType="submit">
          {t("Submit")}
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: 8 }}
          onClick={() => navigate("/TechList")}
        >
          {t("Back to Tech List")}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditTech;
