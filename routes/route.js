import express from "express";
import {
  addRoute,
  deleteRoute,
  getRoute,
  getRoutes,
  updateRoute,
} from "../controllers/route.js";

const router = express.Router();

router.route("/").post(addRoute).get(getRoutes);
router.route("/:id").get(getRoute).delete(deleteRoute).patch(updateRoute);

export default router;
