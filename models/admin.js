import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = mongoose.Schema({
  adminId: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "Admin",
  },
});

AdminSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) {
    bcrypt
      .hash(this.password, 10)
      .then((hashedPassword) => {
        this.password = hashedPassword;
        next();
      })
      .catch((err) => {
        next(err); // Pass the error to the next middleware
      });
  } else {
    next(); // No password modification, proceed to the next middleware
  }
});

const Admin = mongoose.model("admins", AdminSchema);
export default Admin;
