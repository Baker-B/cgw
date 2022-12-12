var express = require("express");
var router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const path = require("path");
const cors = require("cors");
const { saveEncryptedFile } = require("../controllers/cryptoController");
router.use(cors());

const fileStorage = []

/* GET CA  */
router.get("/", function (req, res, next) {
  res.send("Here will be the CA");
});

/* POST CA request */
router.options("/", (req, res) => {
  console.log("reqsert => ", req);
});
router.post(
  "/upload",
  upload.single("file"),
  (req, res) => {
    const filePath = path.join("../uploads/", req.file.originalname);
    console.log("file upload: ", req?.file?.originalname);

    const secret = saveEncryptedFile(req.file.buffer, filePath);
    
    fileStorage.push({fileLink:filePath, secret:secret})
    console.log("fileStorage", fileStorage);
    res
      .status(201)
      .send(
        `File ${req.file.originalname} has been uploaded and encrypted to ${filePath}`
      );
  }
);

router.get("/reqcert");

module.exports = router;
