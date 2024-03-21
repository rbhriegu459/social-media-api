const {mongoose} = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    post: String,
    sender: String,
  },
  {timestamps: false}
);

const Postmodel = mongoose.model("Post", postSchema);

module.exports = Postmodel;