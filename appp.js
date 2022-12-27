// main dependencies
const express = require("express");
// reading request body
const bodyParser = require("body-parser");
// file upload handle middleware
const multer = require("multer");
// crypto module
const crypto = require("crypto");
// read-write files
const fs = require("fs");
const path = require("path");
const stream = require("stream");
// logger
const morgan = require("morgan");
// view engine setup
const { engine } = require("express-handlebars");
// config file handle
require("dotenv").config();
// database connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(
    "mongodb+srv://a-lex-pass:XKLZQPFC9_GrvJesY@cluster0.r0znqqp.mongodb.net/?retryWrites=true&w=majority"
  );
}
// internal dependencies
const router = require('./routes/router');
const key = require("./keyCreator");
const File = require("./models/fileSchema");
const { dataEncryptor, dataDecryptor } = require("./controllers/pkiController");
// main app initialization
const app = express();
// Obviously constants should be kept in environmental variables
const CryptoAlgorithm = "aes-256-cbc";
const host = "http://localhost";
const port = 3073;

// Initial vector
const ivector = crypto.randomBytes(16);
// key generated in ./keyCreator.js
console.log("imported key", key);
// secret for symmetric encryption uploaded files
const secret = {
  iv: ivector,
  key: key,
};
console.log("secret", secret);
// converted secret for db storing
const secretToStore = {
  iv: secret.iv.toString("hex"),
  key: secret.key.toString("hex"),
};
// some convertions of secret for use below
const secretToString = JSON.stringify(secretToStore);
const buff = Buffer.from(secretToString, "utf-8");
const base64Secret = buff.toString("base64");
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
// set of symmetric crypto functions
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
  console.log("122 app fileObject: ", file);
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
// routes
// app.get("/", router.form)
// upload user file
app.post("/upload", upload.single("file"), (req, res, next) => {
  const filePath = path.join("./uploads/", req.file.originalname);
  const encryptedFilePath = getEncryptedFilePath(filePath);
  saveEncryptedFile(
    req.file.buffer,
    filePath,
    secret.key,
    secret.iv,
    base64Secret,
  );
  res.status(201).json({
    status: "ok",
    link: `${host}:${port}/file/${req.file.originalname}`,
    linkToEncrypted: `${host}:${port}/file/${encryptedFilePath}`,
    secret: base64Secret,
  });
});
// getting dectypted with just symmetric key
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
// getting encrypted file
app.get("/file/uploads/:fileName", async (req, res, next) => {
  const filePath = path.join("./uploads", req.params.fileName);
  const buffer = getFile(filePath);
  const readStream = new stream.PassThrough();
  readStream.end(buffer);
  const secret = await File.findOne({ filePath });
  const encryptedKey = dataEncryptor(secret.base64Secret).toString("base64");
  res.set({
    "Content-disposition": "attachment; filename=" + req.params.fileName,
    "Content-Type": "application/octet-stream",
    "Content-Length": buffer.length,
  });
  res.json({ filePath, encryptedKey });
});
// getting decrypted with encrypted secret
app.post("/file/decrypt/:fileName", (req, res, next) => {
  const decryptedKey = dataDecryptor(req.body.encryptedKey).toString("utf-8");
 // got a utf-8 string with secret
  const restoredBuff = Buffer.from(decryptedKey, "base64");
  const restoredString = restoredBuff.toString("utf-8");
  const restoredSecretHex = JSON.parse(restoredString);
  const secret = {
      iv: Buffer.from(restoredSecretHex.iv, "hex"),
      key: Buffer.from(restoredSecretHex.key, "hex"),
    };
    // got rsa decrypted session secret
    // file handle
    const buffer = getEncryptedFileWithNoSuffix(
      path.join("./uploads", req.params.fileName),
      secret.key,
      secret.iv
    );
    const readStream = new stream.PassThrough();
    readStream.end(buffer);
    res.set({
      "Content-disposition": "attachment; filename=" + req.params.fileName,
      "Content-Type": "application/octet-stream",
      "Content-Length": buffer.length,
    });
    res.end(buffer);
});
// run server
app.listen(port);
console.log(`Serving at ${host}:${port}`);
