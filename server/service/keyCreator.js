const crypto = require("crypto");
require("dotenv").config();

// const ival = process.env.IV;
const ival = "Kalishuk";
const hash = crypto
  .createHmac("sha256", ival)
  .update("national aviation university")
  .digest("hex")
.toString();
console.log("hash: ",hash);

module.exports = hash;
