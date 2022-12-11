var express = require("express");
var router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const path = require("path");
const cors = require("cors");
const { saveEncryptedFile } = require("../controllers/cryptoController");
router.use(cors());

/* GET CA  */
router.get("/", function (req, res, next) {
  res.send("Here will be the CA");
});
// const corsOptions = {
//   origin: "http://localhost:2022/",
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
/* POST CA request */
router.options("/", (req, res) => {
  console.log("reqsert => ", req);
});
router.post(
  "/reqcert",
  // cors(corsOptions),
  upload.single("file"),
  (req, res) => {
    const filePath = path.join("../uploads/", req.file.originalname);
    console.log("file upload: ", req?.file?.originalname);

    saveEncryptedFile(req.file.buffer, filePath);
    res
      .status(201)
      .send(
        `File ${req.file.originalname} has been uploaded and encrypted to ${filePath}`
      );
  }
);

router.get("/reqcert");

module.exports = router;
