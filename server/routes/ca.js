var express = require("express");
var router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const path = require("path");
const cors = require("cors");
const stream = require("stream");
const {
  saveEncryptedFile,
  getEncryptedFilePath,
  getEncryptedFileWithNoDecryption,
} = require("../controllers/cryptoController");
router.use(cors());

const fileStorage = [];

/* GET CA  */
router.get("/", function (req, res, next) {
  res.send("Here will be the CA");
});

/* POST CA request */
router.options("/", (req, res) => {
  console.log("reqsert => ", req);
});
router.post("/upload", upload.single("file"), (req, res) => {
  const filePath = path.join("../uploads/", req.file.originalname);
  console.log("file upload: ", req?.file?.originalname);

  const secret = saveEncryptedFile(req.file.buffer, filePath);

  fileStorage.push({ fileName: req.file.originalname, secret: secret });
  console.log("fileStorage", fileStorage);
  res.status(201).send({
    message: `File ${
      req.file.originalname
    } has been uploaded and encrypted to ${getEncryptedFilePath(filePath)}`,
    fileStorage,
  });
});

router.get("/files", (req, res) => {
  console.log("Getting file list");
  res.send(fileStorage);
});

router.get("/file/:fileName", (req, res) => {
  console.log("Getting file:", req.params.fileName);
  const filePath = path.join("../uploads/", req.params.fileName);
  const buffer = getEncryptedFileWithNoDecryption(filePath);

  const readStream = new stream.PassThrough();
  readStream.end(buffer);
  console.log("buffer is: ", buffer);
  res.writeHead(200, {
    "Content-disposition": "attachment; filename=" + req.params.fileName,
    "Content-Type": "application/octet-stream",
    "Content-Length": buffer.length,
  });
  res.end(buffer);
});

module.exports = router;
