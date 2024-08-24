import mongoose from "mongoose";

const BusServiceSchema = mongoose.Schema({
  serviceId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  contactInformation: {
    type: [String],
    required: true,
    unique: true,
  },
  busFleetDetails: {
    type: [String],
  },
  scheduleInformation: {
    type: [String],
  },
});

const BusService = mongoose.model("busservices", BusServiceSchema);
export default BusService;
