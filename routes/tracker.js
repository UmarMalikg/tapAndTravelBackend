import express from "express";
import {
  addTracker,
  deleteTracker,
  getTracker,
  getTrackers,
  updateTracker,
} from "../controllers/tracker.js";

const router = express.Router();

router.route("/").post(addTracker).get(getTrackers);
router.route("/:id").get(getTracker).delete(deleteTracker).patch(updateTracker);

export default router;
