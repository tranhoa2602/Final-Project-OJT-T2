import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Typography,
  message,
  Switch,
  Select,
  Upload,
  Spin,
} from "antd";
import axios from "axios";
import { firebaseConfig } from "../../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UploadOutlined } from "@ant-design/icons";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import BackButton from "../../Components/layouts/BackButton";

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

const AddTech = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [existingTypes, setExistingTypes] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false); // State for loading spinner

  useEffect(() => {
    const fetchExistingTypes = async () => {
      try {
        const response = await axios.get(
          `${firebaseConfig.databaseURL}/technologies.json`
        );
        const types = response.data
          ? Object.values(response.data)
              .map((tech) => tech.techtype)
              .flat()
          : [];
        setExistingTypes([...new Set(types)]);
      } catch (error) {
        console.error("Error fetching existing types: ", error);
      }
    };

    fetchExistingTypes();
  }, []);

  const handleUpload = async () => {
    const storage = getStorage();
    const uploadPromises = fileList.map((file) => {
      const storageRef = ref(storage, `techimage/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file.originFileObj);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            console.error("Upload error: ", error);
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                console.log("Download URL retrieved: ", downloadURL);
                resolve(downloadURL);
              })
              .catch((error) => {
                console.error("Error getting download URL: ", error);
                reject(error);
              });
          }
        );
      });
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (values) => {
    setLoading(true); // Set loading to true when submission starts
    try {
      values.techstatus = values.techstatus ? "Active" : "Inactive";
      values.deletestatus = false;

      const imageUrls = await handleUpload();

      if (imageUrls.length > 0) {
        values.imageUrls = imageUrls;

        await axios.post(
          `${firebaseConfig.databaseURL}/technologies.json`,
          values
        );

        message.success(t("Technology added successfully!"));
        form.resetFields();
        setFileList([]);
        navigate("/TechList");
      } else {
        console.error("No image URLs were retrieved.");
        message.error(t("No images were uploaded."));
      }
    } catch (error) {
      console.error("Error adding technology: ", error);
      message.error(t("Failed to add technology."));
    } finally {
      setLoading(false); // Set loading to false when submission ends
    }
  };

  const handleFailure = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const validateDescription = (_, value) => {
    const wordCount = value
      ? value.split(" ").filter((word) => word).length
      : 0;
    return wordCount <= 20
      ? Promise.resolve()
      : Promise.reject(new Error(t("Description cannot exceed 20 words")));
  };

  return (
    <Spin spinning={loading}>
      {" "}
      {/* Wrap the form with Spin */}
      <BackButton />
      <Form
        {...formItemLayout}
        form={form}
        onFinish={handleSubmit}
        onFinishFailed={handleFailure}
        style={{ height: "100vh" }}
        initialValues={{ techstatus: true }}
      >
        <Title level={3} style={{ textAlign: "center" }}>
          {t("Add New Technology")}
        </Title>
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
            options={existingTypes.map((type) => ({
              label: type,
              value: type,
            }))}
          />
        </Form.Item>
        <Form.Item
          label={t("Tech Status")}
          name="techstatus"
          valuePropName="checked"
        >
          <Switch
            checkedChildren={t("Active")}
            unCheckedChildren={t("Inactive")}
          />
        </Form.Item>
        <Form.Item
          label={t("Tech Description")}
          name="techdescription"
          rules={[{ validator: validateDescription }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={t("Upload Images")} name="techimages">
          <Upload
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
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
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default AddTech;
