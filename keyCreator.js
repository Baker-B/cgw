const crypto = require("crypto");
require("dotenv").config();

const passphrase = "Kalishuk";
const salt = crypto.randomBytes(16);
const key = crypto.scryptSync(passphrase, salt, 32);

module.exports = key;
