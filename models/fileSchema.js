const mongoose = require("mongoose");
const fileSchema = new mongoose.Schema(
  {
    filePath: String,
    base64Secret: String,
  },
  { timestamps: true }
);
fileSchema.set("toObject", { getters: true, virtuals: true });
const File = mongoose.model("File", fileSchema);

module.exports = File;
