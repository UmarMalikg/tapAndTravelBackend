import express from "express";
import {
  addBus,
  deleteBus,
  getBus,
  getBusses,
  updateBus,
} from "../controllers/bus.js";

const router = express.Router();

router.route("/").post(addBus).get(getBusses);
router.route("/:id").get(getBus).delete(deleteBus).patch(updateBus);

export default router;
