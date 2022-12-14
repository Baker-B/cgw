const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  fileName: String,
  filePath: String,
  fileExt: String,
  key: String,
  iv: String,
});

fileSchema.set("toObject", { getters: true, virtuals: true });

const File = mongoose.model("File", fileSchema);

module.exports = File;
