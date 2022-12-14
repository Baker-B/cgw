import axios from "axios";

export const fileList = async function getFilesList() {
  try {
    const response = await axios.get(`http://localhost:2023/ca/files`);
    console.log("response is", response);
    return response;
  } catch (error) {
    console.error(error);
  }
};
