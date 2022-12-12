const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
// const hash = require('../service/keyCreator');

// const CryptoAlgorithm = process.env.CRYPTOALGORITM || "aes-256-cbc";
const CryptoAlgorithm = "rc4";

const ivector = crypto.randomBytes(16)


const hash = crypto
  .createHmac("sha256", ivector)
  .update("national aviation university")
  .digest("hex")
.toString();
console.log("hash created");
// Obviously keys should not be kept in code, these should be populated with environmental variables or key store
const secret = {
  // iv: Buffer.from(process.env.IV, "hex"),
  iv: Buffer.from(ivector),
  key: Buffer.from(hash),
};



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

function saveEncryptedFile(buffer, filePath, key=secret.key, iv=secret.iv) {
  const encrypted = encrypt(CryptoAlgorithm, buffer, key, iv);

  filePath = getEncryptedFilePath(filePath);
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath));
  }

  fs.writeFileSync(filePath, encrypted);
console.log("secret: ", secret);

  return secret
}

function getEncryptedFile(filePath, key, iv) {
  filePath = getEncryptedFilePath(filePath);
  const encrypted = fs.readFileSync(filePath);
  const buffer = decrypt(CryptoAlgorithm, encrypted, key, iv);
  return buffer;
}

module.exports = {
  // encrypt,
  // decrypt,
  getEncryptedFile,
  saveEncryptedFile,
  // getEncryptedFilePath,
};
