import express from "express";
import {
  addUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.js";

const router = express.Router();

router.route("/").post(addUser).get(getUsers);
router.route("/:id").get(getUser).delete(deleteUser).patch(updateUser);

export default router;
