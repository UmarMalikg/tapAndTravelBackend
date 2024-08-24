import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = mongoose.Schema({
  userId: {
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
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  RFIDCardNumber: {
    type: String,
    sparse: true,
  },
  travelHistory: {
    type: String,
  },
  paymentInformation: {
    type: String,
  },
});

UserSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) {
    bcrypt
      .hash(this.password, 10)
      .then((hashedPassword) => {
        this.password = hashedPassword;
        next();
      })
      .catch((err) => {
        next(err);
      });
  } else {
    next();
  }
});

const User = mongoose.model("users", UserSchema);
export default User;
