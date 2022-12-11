var express = require("express");
var router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const path = require("path");
const cors = require("cors");
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
    console.log("file upload: ", req.file.originalname);
    console.log("filePath: ", filePath);
    res.sendStatus(201);
  }
);

module.exports = router;
