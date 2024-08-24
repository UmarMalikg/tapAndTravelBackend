import express from "express";
import { addPayment, getPayment, getPayments } from "../controllers/payment.js";

const router = express.Router();

router.route("/").post(addPayment).get(getPayments);
router.route("/:id").get(getPayment);

export default router;
