import React from "react";
import { message, Upload, Space } from "antd";
import { InboxOutlined } from "@ant-design/icons";

// import getKeys from "../../services/genRsa.mjs";
import { apiPort } from "../../../config/config";
import Link from "antd/es/typography/Link";

const { Dragger } = Upload;
const fileStorage = [];
const propsDragger = {
  name: "file",
  multiple: true,
  method: "POST",
  action: `http://localhost:${apiPort}/ca/upload`,

  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log("info.file: ", info.file, "info.fileList: ", info.fileList);
    }
    if (status === "done") {
      console.log("response: ", info.file.response.message);
      console.log("fileStorage", info.file.response.fileStorage);
      info.file.response.fileStorage.forEach((i) => {
        fileStorage.push(info.file.response.fileStorage);
      });

      console.log("fileStorage", fileStorage);
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const HomePage = () => {
  return (
    <>
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
            Support for a single or bulk upload. Strictly prohibit from
            uploading company data or other band files
          </p>
        </Dragger>
      </Space>
      <Link href="http://localhost:2022/files">Files</Link>
    </>
  );
};
export default HomePage;
