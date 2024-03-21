const {mongoose} =  require("mongoose");

const connectToMongoDB = async () => {
  try {
    return await mongoose.connect("mongodb://localhost:27017", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectToMongoDB;