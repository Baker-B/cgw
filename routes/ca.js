exports.genKeyPair = (req, res) => {
  const genKeyPair = require("../createKey");
  genKeyPair();
  console.log("rsa key pair created");
  res.render("form", { keyPair });
};
