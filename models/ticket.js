import mongoose from "mongoose";

const TicketSchema = mongoose.Schema(
  {
    ticketId: {
      type: Number,
      required: true,
      unique: true,
    },
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "buses",
      required: true,
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "routes",
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model("tickets", TicketSchema);
export default Ticket;
