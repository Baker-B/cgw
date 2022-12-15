const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// The `generateKeyPairSync` method accepts two arguments:
// 1. The type ok keys we want, which in this case is "rsa"
// 2. An object with the properties of the key
// const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
// 	// The standard secure default length for RSA keys is 1024 bits
// 	modulusLength: 1024,
// })
// console.log(
// 	publicKey.export({
// 		type: "pkcs1",
// 		format: "pem",
// 	}),
// 	privateKey.export({
// 		type: "pkcs1",
// 		format: "pem",

// 	})
// )

// This is the data we want to encrypt
const dataEncryptor = (dataToEncrypt, passphrase = "sself") => {
  const pathJoined = path.join(
    __dirname,
    "../client/src/userCert/user_1_cert.pem"
  );
  console.log("30 app pathJoined: ", pathJoined);
  const cert = new crypto.X509Certificate(fs.readFileSync(pathJoined));
  const publicKey = cert.publicKey;
  console.log("33 app publicKey: ", publicKey);
  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
      passphrase: passphrase,
    },
    // We convert the data string to a buffer using `Buffer.from`
    Buffer.from(dataToEncrypt)
  );
  // The encrypted data is in the form of bytes, so we print it in base64 format
  // so that it's displayed in a more readable form
  return encryptedData;
};

const dataDecryptor = (encryptedData, passphrase = "sself") => {
  console.log("encryptedData", encryptedData);
  const pathJoined = path.join(
    __dirname,
    "../client/src/userCert/user_1_key.pem"
  );
  encryptedData = Buffer.from(encryptedData, "base64");

  const privateKey = fs.readFileSync(pathJoined);
  const decryptedData = crypto.privateDecrypt(
    {
      key: privateKey,
      // In order to decrypt the data, we need to specify the
      // same hashing function and padding scheme that we used to
      // encrypt the data in the previous step
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
      passphrase: passphrase,
    },
    encryptedData
  );

  // The decrypted data is of the Buffer type, which we can convert to a
  // string to reveal the original data
  // console.log("decrypted data: ", decryptedData.toString())
  return decryptedData;
};

// // Create some sample data that we want to sign
// const verifiableData = "this need to be verified"

// // The signature method takes the data we want to sign, the
// // hashing algorithm, and the padding scheme, and generates
// // a signature in the form of bytes
// const signature = crypto.sign("sha256", Buffer.from(verifiableData), {
// 	key: privateKey,
// 	padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
// })

// console.log(signature.toString("base64"))

// // To verify the data, we provide the same hashing algorithm and
// // padding scheme we provided to generate the signature, along
// // with the signature itself, the data that we want to
// // verify against the signature, and the public key
// const isVerified = crypto.verify(
// 	"sha256",
// 	Buffer.from(verifiableData),
// 	{
// 		key: publicKey,
// 		padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
// 	},
// 	signature
// )

// // isVerified should be `true` if the signature is valid
// console.log("signature verified: ", isVerified)

module.exports = {
  dataEncryptor,
  dataDecryptor,
};
