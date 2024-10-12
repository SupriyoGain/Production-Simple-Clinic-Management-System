const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllUsersController,
  getAllPatientsController,
  changeAccountStatusController,
} = require("../controllers/adminCtrl");
const router = express.Router();

router.get("/getAllUsers", authMiddleware, getAllUsersController);

router.get("/getAllPatients", authMiddleware, getAllPatientsController);

router.post(
  "/changeAccountStatus",
  authMiddleware,
  changeAccountStatusController
);

module.exports = router;
