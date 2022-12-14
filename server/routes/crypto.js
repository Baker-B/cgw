var express = require("express");
var router = express.Router();

/* GET crypto listing. */
router.get("/", (req, res, next) => {
  res.send(
    "base crypto url \nthere should be upload form and links to other API resources"
  );
});
router.get("/files", (req, res, next) => {
  res.send("files list crypto url \nit is a link for get files list");
});

router.post("/upload", (req, res, next) => {
  res.send("upload crypto url \nit is a link for upload file");
});

router.get("/files/:fileName", (req, res, next) => {
  res.send(
    "get file from server crypto url \nwhich form of file (enc? enc+secret?) should be received?"
  );
});

router.delete("/files/:fileName", (req, res, next) => {
  res.send(
    "delete file from server crypto url \ndelete file from storage and db"
  );
});
module.exports = router;
