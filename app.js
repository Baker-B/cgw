const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const stream = require("stream");
const morgan = require("morgan");
const hash = require("./keyCreator");
const { engine } = require("express-handlebars");

const router = require("./routes/router");
require("dotenv").config();

const CryptoAlgorithm = process.env.CRYPTOALGORITM;
const host = process.env.HOST;
const port = process.env.PORT;

// Obviously keys should not be kept in code, these should be populated with environmental variables or key store
const secret = {
  iv: Buffer.from(process.env.IV, "hex"),
  key: Buffer.from(hash),
};

// configure Handlebars view engine
app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.disable("x-powered-by");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// encryption
function encrypt(algorithm, buffer, key, iv) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return encrypted;
}
// decryption
function decrypt(algorithm, buffer, key, iv) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([decipher.update(buffer), decipher.final()]);
  return decrypted;
}

function getEncryptedFilePath(filePath) {
  return path.join(
    path.dirname(filePath),
    path.basename(filePath, path.extname(filePath)) +
      "_encrypted" +
      path.extname(filePath)
  );
}

function saveEncryptedFile(buffer, filePath, key, iv) {
  const encrypted = encrypt(CryptoAlgorithm, buffer, key, iv);

  filePath = getEncryptedFilePath(filePath);
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath));
  }

  fs.writeFileSync(filePath, encrypted);
}

function getEncryptedFile(filePath, key, iv) {
  filePath = getEncryptedFilePath(filePath);
  const encrypted = fs.readFileSync(filePath);
  const buffer = decrypt(CryptoAlgorithm, encrypted, key, iv);
  return buffer;
}

app.get("/", router.form);

app.post("/upload", upload.single("file"), (req, res, next) => {
  console.log("key: ", req.body.keyPair);
  console.log("file upload: ", req.file.originalname);

  const keyPair = req.body.keyPair;
  const filePath = path.join("./uploads/", req.file.originalname);

  saveEncryptedFile(req.file.buffer, filePath, secret.key, secret.iv);

  res.status(201).json({
    status: "ok",
    link: `${host}:${port}/file/${req.file.originalname}`,
  });
});

app.get("/file/:fileName", (req, res, next) => {
  console.log("Getting file:", req.params.fileName);
  const buffer = getEncryptedFile(
    path.join("./uploads", req.params.fileName),
    secret.key,
    secret.iv
  );
  const readStream = new stream.PassThrough();
  readStream.end(buffer);
  res.writeHead(200, {
    "Content-disposition": "attachment; filename=" + req.params.fileName,
    "Content-Type": "application/octet-stream",
    "Content-Length": buffer.length,
  });
  res.end(buffer);
});

app.listen(port);
console.log(`Serving at ${host}:${port}`);
