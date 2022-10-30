const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const _ = require("lodash");

const app = express();

// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 3 * 1024 * 1024 * 1024, // 3MB max file(s) size
    },
  })
);

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.post("/upload", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field to retrieve the uploaded file
      let fileForUpload = req.files.fileForUpload;
      //Use the express-fileupload mv() method to place the file in the upload directory (i.e. "uploads")
      fileForUpload.mv(`./uploads/${fileForUpload.name}`);
      // send response
      console.log("fileForUpload object", fileForUpload);
      res.send({
        status: true,
        message: "File uploadedd",
        data: {
          name: fileForUpload.name,
          mimetype: fileForUpload.mimetype,
          size: fileForUpload.size,
        },
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

//start app
const port = process.env.PORT || 2022;

app.listen(port, () => console.log(`App is listening on port ${port}.`));
