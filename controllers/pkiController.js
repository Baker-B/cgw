const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Data to encrypt
const dataEncryptor = (dataToEncrypt, passphrase = "sself") => {
  const pathJoined = path.join(
    __dirname,
    "../client/src/userCert/user_1_cert.pem"
  );
  const publicKey = crypto.createPublicKey(fs.readFileSync(pathJoined)).export({type:'pkcs1', format:'pem'})
  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
      passphrase: passphrase,
    },
    Buffer.from(dataToEncrypt)
  );
  return encryptedData;
};

const dataDecryptor = (encryptedData, passphrase = "sself") => {
  const pathJoined = path.join(
    __dirname,
    "../client/src/userCert/user_1_key.pem"
  );
  encryptedData = Buffer.from(encryptedData, "base64");
  const privateKey = fs.readFileSync(pathJoined);
  const decryptedData = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
      passphrase: passphrase,
    },
    encryptedData
  );
  return decryptedData;
};
module.exports = {
  dataEncryptor,
  dataDecryptor,
};
