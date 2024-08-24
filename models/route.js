import mongoose from "mongoose";

const RouteSchema = mongoose.Schema({
  routeId: {
    type: Number,
    required: true,
    unique: true,
  },
  startLocation: {
    type: String,
    required: true,
  },
  endLocation: {
    type: String,
    required: true,
  },
  schedule: {
    type: String,
  },
});

const Route = mongoose.model("routes", RouteSchema);
export default Route;
