import express from "express";
import {
  addBusService,
  addNewContactDetailsInService,
  countCompanies,
  countRevenueByACompany,
  deleteBusService,
  deleteOneConactFromService,
  getBusService,
  getBusServices,
  getTicketsForCompany,
} from "../controllers/busService.js";

const router = express.Router();

router.route("/:id/getticketsforaservice").get(getTicketsForCompany);
router.route("/:id/revenuebyacompany").get(countRevenueByACompany);
router.route("/total").get(countCompanies);
router.route("/").post(addBusService).get(getBusServices);
router.route("/:id").get(getBusService).delete(deleteBusService);
router.route("/:id/addNewContact").patch(addNewContactDetailsInService);
router.route("/:id/deleteOneContact").patch(deleteOneConactFromService);

export default router;
