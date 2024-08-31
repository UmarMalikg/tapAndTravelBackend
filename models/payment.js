import mongoose from "mongoose";

const PaymentSchema = mongoose.Schema(
  {
    paymentId: {
      type: Number,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tickets",
      required: true,
    },
    transactionStatus: {
      type: String,
      enum: ["Pending", "Completed"],
      required: true,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("payments", PaymentSchema);
export default Payment;
