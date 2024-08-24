import express from "express";
import {
  addTicket,
  deleteTicket,
  getTicket,
  getTickets,
  updateTicket,
} from "../controllers/ticket.js";

const router = express.Router();

router.route("/").post(addTicket).get(getTickets);
router.route("/:id").get(getTicket).delete(deleteTicket).patch(updateTicket);

export default router;
