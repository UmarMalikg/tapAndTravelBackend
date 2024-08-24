import Analytics from "../models/analytics.js";
import Bus from "../models/bus.js";
import Payment from "../models/payment.js";
import Ticket from "../models/ticket.js";
import Tracker from "../models/tracker.js";
import User from "../models/user.js";

// get next analytics id
const getNextAnalyticsId = async () => {
  try {
    const result = await Analytics.aggregate([
      { $group: { _id: null, maxId: { $max: "$analyticsId" } } },
    ]);
    return result.length > 0 ? result[0].maxId + 1 : 1;
  } catch (err) {
    throw new Error("Error fetching next admin ID"); // Throw a specific error message
  }
};

// add new analytics
