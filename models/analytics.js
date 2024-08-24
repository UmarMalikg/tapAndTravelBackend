import mongoose from "mongoose";

const AnalyticsSchema = mongoose.Schema({
  analyticsId: {
    type: Number,
    required: true,
    unique: true,
  },
  passengerData: {
    type: String,
    required: true,
  },
  ticketData: {
    type: [String],
    required: true,
  },
  busTrackingData: {
    type: [String],
    required: true,
  },
  paymentData: {
    type: String,
    required: true,
  },
  generateReports: {
    type: String,
  },
});

const Analytics = mongoose.model("analytics", AnalyticsSchema);
export default Analytics;
