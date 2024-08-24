import mongoose from "mongoose";

const BusSchema = mongoose.Schema({
  busId: {
    type: Number,
    required: true,
    unique: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "busservices",
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "routes",
    required: true,
  },
});

const Bus = mongoose.model("buses", BusSchema);
export default Bus;
