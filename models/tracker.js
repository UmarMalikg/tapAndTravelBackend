import mongoose from "mongoose";

const TrackerSchema = mongoose.Schema(
  {
    trackerId: {
      type: Number,
      required: true,
      unique: true,
    },
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "buses",
    },
    gpsCoordinates: {
      type: [Number, Number],
    },
    speed: {
      type: Number,
    },
    passengersCount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Tracker = mongoose.model("trackers", TrackerSchema);
export default Tracker;
