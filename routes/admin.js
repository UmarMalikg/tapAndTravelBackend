import express from "express";
import {
  addAdmin,
  deleteAdmin,
  getAdmin,
  getAdmins,
  updateAdmin,
} from "../controllers/admin.js";

const router = express.Router();
router.route("/").post(addAdmin).get(getAdmins);

router.route("/:id").get(getAdmin).delete(deleteAdmin).patch(updateAdmin);

export default router;
