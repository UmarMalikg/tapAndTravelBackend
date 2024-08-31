import express from "express";
import {
  addPayment,
  countPayment,
  getPayment,
  getPayments,
} from "../controllers/payment.js";

const router = express.Router();

router.route("/total").get(countPayment);
router.route("/").post(addPayment).get(getPayments);
router.route("/:id").get(getPayment);

export default router;
