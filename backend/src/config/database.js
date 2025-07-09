import mongoose from "mongoose";
import config from "../utils/config.js";
const connectDB = async () => {

  await mongoose.connect(config.mongoDb.MONGO_URI, config.mongoDb.options)
    .then(() => {
      console.log("mongodb connected")
    }).catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    })

};

export default connectDB;
