var express = require("express");
var router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const path = require("path");

/* GET CA  */
router.get("/", function (req, res, next) {
  res.send("Here will be the CA");
});

/* POST CA request */
router.post("/reqcert", upload.single("file"), (req, res) => {
  const filePath = path.join("../uploads/", req.file.originalname);
  console.log("file upload: ", req.file.originalname);
  console.log("filePath: ", filePath);
  res.sendStatus(201);
});

module.exports = router;
