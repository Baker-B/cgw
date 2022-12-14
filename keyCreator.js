const crypto = require("crypto");
require("dotenv").config();

const ival = process.env.IV;
const hash = crypto
  .createHmac("sha256", ival)
  .update("national aviation university")
  .digest("hex");
// .toString();

module.exports = hash;

const passphrase = "Kalishuk";
const salt = crypto.randomBytes(16);
const key = crypto.scryptSync(passphrase, salt, 32);

module.exports = key;
