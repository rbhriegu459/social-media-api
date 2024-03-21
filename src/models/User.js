const {mongoose} = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
  },
  {timestamps: false} //disables createdat and updatedat
);
const Usermodel = mongoose.model("User", userSchema);

module.exports = Usermodel;