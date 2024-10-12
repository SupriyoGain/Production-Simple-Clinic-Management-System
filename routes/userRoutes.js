const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyPatientController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllPatientsController,
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", loginController);

router.post("/register", registerController);

router.post("/getUserData", authMiddleware, authController);

router.post("/apply-patient", authMiddleware, applyPatientController);

router.post(
  "/get-all-notification",
  authMiddleware,
  getAllNotificationController
);
router.post(
  "/delete-all-notification",
  authMiddleware,
  deleteAllNotificationController
);

router.get("/getAllPatients", authMiddleware, getAllPatientsController);

// router.post(
//   "/booking-availability",
//   authMiddleware,
//   bookingAvailabilityController
// );

// router.get("/user-appointments", authMiddleware, userAppointmentsController);

module.exports = router;
