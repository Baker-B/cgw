const crypto = require("crypto");
require("dotenv").config();

const ival = process.env.IV;
const hash = crypto
  .createHmac("sha256", ival)
  .update("national aviation university")
  .digest("hex");
// .toString();

module.exports = hash;
