const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const stream = require("stream");
const morgan = require("morgan");
const { engine } = require("express-handlebars");

const router = require("./routes/router");
const key = require("./keyCreator");
require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const File = require("./models/fileSchema");
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(
    "mongodb+srv://a-lex-pass:XKLZQPFC9_GrvJesY@cluster0.r0znqqp.mongodb.net/?retryWrites=true&w=majority"
  );
}

const app = express();
const CryptoAlgorithm = "aes-256-cbc";
const host = "http://localhost";
const port = 3073;

// Obviously keys should not be kept in code, these should be populated with environmental variables or key store
const ivector = crypto.randomBytes(16);
console.log("imported key", key);
const secret = {
  iv: ivector,
  key: key,
};
console.log("secret", secret);
const secretToStore = {
  iv: secret.iv.toString("hex"),
  key: secret.key.toString("hex"),
};
const secretToString = JSON.stringify(secretToStore);
const buff = Buffer.from(secretToString, "utf-8");
const base64Secret = buff.toString("base64");
// adding public key encryption

const restoredBuff = Buffer.from(base64Secret, "base64");
const restoredString = restoredBuff.toString("utf-8");
const restoredSecretHex = JSON.parse(restoredString);
const restoredSecret = {
  iv: Buffer.from(restoredSecretHex.iv, "hex"),
  key: Buffer.from(restoredSecretHex.key, "hex"),
};
console.log("restoredSecret", restoredSecret);
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
// configure folder for public files
app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// configure logger & some sequrity
app.use(morgan("dev"));
app.disable("x-powered-by");
// configure multer store
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

// TODO: spaces and unsupported symbols handle
function getEncryptedFilePath(filePath) {
  return path.join(
    path.dirname(filePath),
    path.basename(filePath, path.extname(filePath)) +
      "_encrypted" +
      path.extname(filePath)
  );
}

// function saveEncryptedFile(buffer, filePath, key, iv) {
//   const encrypted = encrypt(CryptoAlgorithm, buffer, key, iv);

//   filePath = getEncryptedFilePath(filePath);
//   if (!fs.existsSync(path.dirname(filePath))) {
//     fs.mkdirSync(path.dirname(filePath));
//   }

//   fs.writeFileSync(filePath, encrypted);
// }
async function saveEncryptedFile(buffer, filePath, key, iv, base64Secret) {
  const encrypted = encrypt(CryptoAlgorithm, buffer, key, iv);
  filePath = getEncryptedFilePath(filePath);
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath));
  }
  fs.writeFileSync(filePath, encrypted);

  const file = new File({
    filePath,
    base64Secret,
  });
  await file.save();
  console.log("fileObject: ", file);
}

function getEncryptedFile(filePath, key, iv) {
  filePath = getEncryptedFilePath(filePath);
  const encrypted = fs.readFileSync(filePath);
  const buffer = decrypt(CryptoAlgorithm, encrypted, key, iv);
  return buffer;
}
function getEncryptedFileWithNoSuffix(filePath, key, iv) {
  const encrypted = fs.readFileSync(filePath);
  const buffer = decrypt(CryptoAlgorithm, encrypted, key, iv);
  return buffer;
}

function getFile(filePath) {
  const encrypted = fs.readFileSync(filePath);
  const buffer = Buffer.from(encrypted);
  return buffer;
}

app.get("/", router.form);

app.post("/upload", upload.single("file"), (req, res, next) => {
  const filePath = path.join("./uploads/", req.file.originalname);
  const encryptedFilePath = getEncryptedFilePath(filePath);
  saveEncryptedFile(
    req.file.buffer,
    filePath,
    secret.key,
    secret.iv,
    base64Secret
  );

  res.status(201).json({
    status: "ok",
    link: `${host}:${port}/file/${req.file.originalname}`,
    linkToEncrypted: `${host}:${port}/file/${encryptedFilePath}`,
    secret: base64Secret,
  });
});
// getting dectypted with symmetryc key
app.get("/file/:fileName", (req, res, next) => {
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

// getting encrypted
app.get("/file/uploads/:fileName", (req, res, next) => {
  console.log("Getting encrypted file:", req.params.fileName);
  const buffer = getFile(path.join("./uploads", req.params.fileName));
  const readStream = new stream.PassThrough();
  readStream.end(buffer);
  res.writeHead(200, {
    "Content-disposition": "attachment; filename=" + req.params.fileName,
    "Content-Type": "application/octet-stream",
    "Content-Length": buffer.length,
  });
  res.end(buffer);
});
// getting decrypted with secret
app.post("/file/decrypt/:fileName", (req, res, next) => {
  // secret restore
  console.log("req.body.secret", req.body.secret, typeof req.body.secret);

  const restoredBuff = Buffer.from(req.body.secret, "base64");
  console.log("restoredBuff", restoredBuff, typeof restoredBuff);

  const restoredString = restoredBuff.toString("utf-8");
  console.log("restoredString", restoredString, typeof restoredString);

  const restoredSecretHex = JSON.parse(restoredString);
  console.log("restoredSecretHex", restoredSecretHex, typeof restoredSecretHex);
  const secret = {
    iv: Buffer.from(restoredSecretHex.iv, "hex"),
    key: Buffer.from(restoredSecretHex.key, "hex"),
  };
  console.log("secret", secret);
  //
  // file handle
  console.log("req.body.linkToEncrypted", req.body.linkToEncrypted);
  //   const fileName = req.body.linkToEncrypted.split("/").slice(-1).toString();
  console.log("fileName", req.params.fileName);
  //   const fileRealPath = path.join("./uploads/", fileName);
  //   console.log("fileRealPath", fileRealPath);
  const buffer = getEncryptedFileWithNoSuffix(
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
