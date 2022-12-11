import React from "react";
import { message, Upload, Button, Form, Input, Space } from "antd";
import { InboxOutlined } from "@ant-design/icons";
// import getKeys from "../../services/genRsa.mjs";
const { Dragger } = Upload;
const propsDragger = {
  name: "file",
  multiple: true,
  method: "POST",
  action: "http://localhost:2023/ca/reqcert",

  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log("info.file: ", info.file, "info.fileList: ", info.fileList);
    }
    if (status === "done") {
      console.log("response: ", info.file.response);
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};
const sendRequestForRSA = (values) => {
  // console.log("Public key is: ", getKeys());
  console.log("Success:", values);
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const HomePage = () => (
  <>
    <h1>Start!</h1>
    <h2>Create a key pair first!</h2>
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 8,
      }}
      onFinish={sendRequestForRSA}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: "Please input your username!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>

    <h2>Uploader</h2>
    <Space
      style={{
        display: "flex",
        width: "50%",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <Dragger {...propsDragger}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading
          company data or other band files
        </p>
      </Dragger>
    </Space>
  </>
);
export default HomePage;
