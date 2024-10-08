import express from "express";
import {
  addRoute,
  countRoutes,
  deleteRoute,
  getBussesOnARoute,
  getRoute,
  getRoutes,
  updateRoute,
} from "../controllers/route.js";

const router = express.Router();

router.route("/:id/bussesonroute").get(getBussesOnARoute);
router.route("/total").get(countRoutes);
router.route("/").post(addRoute).get(getRoutes);
router.route("/:id").get(getRoute).delete(deleteRoute).patch(updateRoute);

export default router;
