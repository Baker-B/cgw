// import generateRSAKeypair from "generate-rsa-keypair";

// const pair = generateRSAKeypair();

// const getKeys = () => {
//   console.log("private:", pair.private);
//   console.log("private:", pair.public);
//   return pair;
// };

// export default getKeys;

import { RSAEncryption } from "@ryanbekhen/cryptkhen";

const rsa = new RSAEncryption();

const pem = await rsa.generateKey();

export default pem;
