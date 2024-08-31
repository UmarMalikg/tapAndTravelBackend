import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config.js";

// importing routes
import adminRoute from "./routes/admin.js"; // admin route
import userRoute from "./routes/user.js";
import routeRoute from "./routes/route.js";
import busServiceRoute from "./routes/busService.js";
import busRoute from "./routes/bus.js";
import ticketRoute from "./routes/ticket.js";
import payementRoute from "./routes/payment.js";
import trackerRoute from "./routes/tracker.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
connectDB();

app.use("/admin", adminRoute);
app.use("/user", userRoute);
app.use("/route", routeRoute);
app.use("/service", busServiceRoute);
app.use("/bus", busRoute);
app.use("/ticket", ticketRoute);
app.use("/payment", payementRoute);
app.use("/tracker", trackerRoute);

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
