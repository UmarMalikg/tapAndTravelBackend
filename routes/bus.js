import express from "express";
import {
  addBus,
  countBusses,
  deleteBus,
  getBus,
  getBusses,
  updateBus,
} from "../controllers/bus.js";

const router = express.Router();

router.route("/total").get(countBusses);
router.route("/").post(addBus).get(getBusses);
router.route("/:id").get(getBus).delete(deleteBus).patch(updateBus);

export default router;
