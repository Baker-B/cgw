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
const { dataEncryptor, dataDecryptor } = require("./controllers/pkiController");
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
app.get("/file/uploads/:fileName", async (req, res, next) => {
  console.log("184 Getting encrypted file:", req.params.fileName);
  const filePath = path.join("./uploads", req.params.fileName);
  console.log("186 filePath: ", filePath);
  const buffer = getFile(filePath);
  const readStream = new stream.PassThrough();
  readStream.end(buffer);
  const secret = await File.findOne({ filePath });
  console.log("191 secret found", secret.base64Secret, typeof base64Secret);
  const encryptedKey = dataEncryptor(secret.base64Secret).toString("base64");
  console.log("193 encryptedKey", encryptedKey.toString("base64"));

  res.set({
    "Content-disposition": "attachment; filename=" + req.params.fileName,
    "Content-Type": "application/octet-stream",
    "Content-Length": buffer.length,
  });
  res.json({ filePath, encryptedKey });
});
// getting decrypted with secret
app.post("/file/decrypt/:fileName", (req, res, next) => {
  // secret restore
  console.log("req.body.secret", req.body.secret, typeof req.body.secret);
  console.log(
    "207 req.body.encryptedKey",
    req.body.encryptedKey,
    typeof req.body.encryptedKey
  );
  const decryptedKey = dataDecryptor(req.body.encryptedKey);

  console.log("214 decryptedKey", decryptedKey.toString("base64"));
  const restoredBuff = Buffer.from(req.body.secret, "base64");
  const restoredString = restoredBuff.toString("utf-8");
  const restoredSecretHex = JSON.parse(restoredString);
  const secret = {
    iv: Buffer.from(restoredSecretHex.iv, "hex"),
    key: Buffer.from(restoredSecretHex.key, "hex"),
  };
  console.log("222 secret", secret);
  //
  // file handle
  console.log("225 req.body.linkToEncrypted", req.body.linkToEncrypted);
  //   const fileName = req.body.linkToEncrypted.split("/").slice(-1).toString();
  console.log("227 fileName", req.params.fileName);
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
