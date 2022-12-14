import React, { useEffect } from "react";
import Link from "antd/es/typography/Link";
import axios from "axios";
// import { Space, Table } from "antd";
let data = [];

async function getFiles() {
  try {
    const resp = await axios.get(`http://localhost:2023/ca/files`);
    data.push(resp.data);
  } catch (error) {
    console.error(error);
  }
}
// const onDelete = () => {
//   console.log(`Deleting file ${data}`);
// };
// const columns = [
//   {
//     title: "File name",
//     dataIndex: "fileName",
//     key: "fileName",
//     render: (text) => <a href={text}>{text}</a>,
//   },
//   {
//     title: "Action",
//     key: "action",
//     render: (_) => (
//       <Space size="middle">
//         <button onClick={onDelete}>Delete</button>
//       </Space>
//     ),
//   },
// ];

const FilesList = () => {
  useEffect(() => {
    getFiles();
    console.log("data is: ", data);
  }, []);

  return (
    <>
      <Link href="http://localhost:2022/">Home</Link>
      {/* <Table columns={columns} dataSource={tableData} />; */}
    </>
  );
};
export default FilesList;
