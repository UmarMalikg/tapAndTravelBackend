import mongoose from "mongoose";

//db connection
const connectDB = async () => {
  mongoose
    .connect(process.env.MONGO_URI, {})
    .then(console.log("mongodb connected"))
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
};

export default connectDB;
