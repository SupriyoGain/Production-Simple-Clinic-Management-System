const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getPatientInfoController,
  updateProfileController,
} = require("../controllers/patientCtrl");
const { authController } = require("../controllers/userCtrl");
const router = express.Router();

router.post("/getPatientInfo", authMiddleware, getPatientInfoController);

router.post("/updateProfile", authMiddleware, updateProfileController);

// router.get('/patient-appointments',authMiddleware,patientAppointmentsController)

// router.post("/update-status", authMiddleware, updateStatusController);

module.exports = router;
