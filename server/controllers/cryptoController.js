const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const secret = require("../service/keyCreator");

// const CryptoAlgorithm = process.env.CRYPTOALGORITM || "aes-256-cbc";
const CryptoAlgorithm = "rc4";

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

function saveEncryptedFile(buffer, filePath, key = secret.key, iv = secret.iv) {
  const encrypted = encrypt(CryptoAlgorithm, buffer, key, iv);

  filePath = getEncryptedFilePath(filePath);
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath));
  }
  fs.writeFileSync(filePath, encrypted);
  return secret;
}

function getEncryptedFile(filePath, key, iv) {
  filePath = getEncryptedFilePath(filePath);
  const encrypted = fs.readFileSync(filePath);
  const buffer = decrypt(CryptoAlgorithm, encrypted, key, iv);
  return buffer;
}
function getEncryptedFileWithNoDecryption(filePath) {
  filePath = getEncryptedFilePath(filePath);
  const fileName = filePath.split("/").slice(-1);
  const encrypted = fs.readFileSync(fileName, { encoding: "utf8", flag: "r" });
  console.log("enc: ", encrypted);
  // const buffer = Buffer.from(encrypted);
  return encrypted;
}

module.exports = {
  // encrypt,
  // decrypt,
  getEncryptedFile,
  saveEncryptedFile,
  getEncryptedFilePath,
  getEncryptedFileWithNoDecryption,
};
