const crypto = require("crypto");
require("dotenv").config();

// // const ival = process.env.IV;
// const ival = "Kalishuk";
// const hash = crypto
//   .createHmac("sha256", ival)
//   .update("national aviation university")
//   .digest("hex")
//   .toString();
// console.log("hash created");

// Obviously keys should not be kept in code, these should be populated with environmental variables or key store
const secret = {
  // iv: Buffer.from(process.env.IV, "hex"),
  iv: Buffer.from("", "hex"),
  key: Buffer.from(
    "6245cb9b8dab1c1630bb3283063f963574d612ca6ec60bc8a5d1e07ddd3f7c53",
    "hex"
  ),
};

module.exports = hash;
module.exports = secret;
