import express from "express";
import {
  addBusService,
  addNewContactDetailsInService,
  deleteBusService,
  deleteOneConactFromService,
  getBusService,
  getBusServices,
} from "../controllers/busService.js";

const router = express.Router();

router.route("/").post(addBusService).get(getBusServices);
router.route("/:id").get(getBusService).delete(deleteBusService);
router.route("/:id/addNewContact").patch(addNewContactDetailsInService);
router.route("/:id/deleteOneContact").patch(deleteOneConactFromService);

export default router;
