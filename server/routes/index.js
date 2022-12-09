const express = require('express');
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const path = require("path");
const cors = require("cors");
const { saveEncryptedFile } = require('../controllers/cryptoController');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.options("/upload", cors(), (req, res) => {
  console.log("reqsert => ", req);
  res.sendStatus(200)
});
router.post("/upload",cors(), upload.single("file"),(req,res)=> {
  const filePath = path.join("./uploads/", req.file.originalname);
    console.log("file upload: ", req.file.originalname);
    console.log("filePath: ", filePath);

    saveEncryptedFile(req.file.buffer,filePath)

    res.sendStatus(201);
})

module.exports = router;
