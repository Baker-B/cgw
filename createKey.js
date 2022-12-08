// from https://www.zachgollwitzer.com/posts/public-key-cryptography
// file: createKey.js
// https://github.com/zachgoll/making-sense-of-public-key-cryptography/blob/master/createKey.js

const crypto = require("crypto");
const fs = require("fs");

const genKeyPair = () => {
  // check if keys are exists
  const pathPub = "./clientKeys/id_rsa_pub.pem";
  const pathPriv = "./clientKeys/id_rsa_priv.pem";
  fs.access(pathPub, fs.F_OK, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  fs.access(pathPriv, fs.F_OK, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });

  // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 1024, // bits - standard for RSA keys
    publicKeyEncoding: {
      type: "pkcs1", // "Public Key Cryptography Standards 1"
      format: "pem", // Most common formatting choice
    },
    privateKeyEncoding: {
      type: "pkcs1", // "Public Key Cryptography Standards 1"
      format: "pem", // Most common formatting choice
    },
  });

  // Create the public key file
  fs.writeFileSync(__dirname + "/clientKeys/id_rsa_pub.pem", keyPair.publicKey);

  // Create the private key file
  fs.writeFileSync(
    __dirname + "/clientKeys/id_rsa_priv.pem",
    keyPair.privateKey
  );
};

module.exports = genKeyPair;
