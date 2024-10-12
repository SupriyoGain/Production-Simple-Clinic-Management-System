const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const patientModel = require("../models/patientModel");
const moment = require("moment");

const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res
      .status(201)
      .send({ message: "Registration Successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid email or password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "User not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Auth error",
      success: false,
      error,
    });
  }
};

const applyPatientController = async (req, res) => {
  try {
    const newPatient = await patientModel({ ...req.body, status: "pending" });
    await newPatient.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "Apply-patient-request",
      message: `${newPatient.firstName} ${newPatient.lastName} has applied for a patient's account`,
      data: {
        patientId: newPatient._id,
        name: newPatient.firstName + " " + newPatient.lastName,
        onClickPath: "/admin/patients",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Patient account applied successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while applying for patient",
    });
  }
};

const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "All notifications are marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};

const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Unable to delete all notifications",
      error,
    });
  }
};

const getAllPatientsController = async (req, res) => {
  try {
    const patients = await patientModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Patient's list fetched successfully",
      data: patients,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching patients",
      error,
    });
  }
};

// const bookAppointmentController = async (req, res) => {
//   try {
//     req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
//     req.body.time = moment(req.body.time, "HH:mm").toISOString();
//     req.body.status = "pending";
//     const newAppointment = new appointmentModel(req.body);
//     await newAppointment.save();
//     const user = await userModel.findOne({ _id: req.body.patientInfo.userId });
//     user.notification.push({
//       type: "New-appointment-request",
//       message: `A new appointment request from ${req.body.userInfo.name}`,
//       onClickPath: "/user/appointments",
//     });
//     await user.save();
//     res.status(200).send({
//       success: true,
//       message: "Appointment booked successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error while booking appointment",
//       error,
//     });
//   }
// };

// const bookingAvailabilityController = async (req, res) => {
//   try {
//     const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
//     const fromTimings = moment(req.body.timings, "HH:mm").subtract(
//       1,
//       "hour".toISOString()
//     );
//     const toTimings = moment(req.body.timings, "HH:mm").add(
//       1,
//       "hour".toISOString()
//     );
//     const patientId = req.body.patientId;
//     const appointments = await appointmentModel.find({
//       patientId,
//       date,
//       timings: {
//         $gte: fromTimings,
//         $lte: toTimings,
//       },
//     });
//     if (appointments.length > 0) {
//       return res.status(200).send({
//         success: true,
//         message: "Appointment not available at this time",
//       });
//     } else {
//       return res.status(200).send({
//         success: true,
//         message: "Appointment available",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error in booking",
//       error,
//     });
//   }
// };

// const userAppointmentsController = async (req, res) => {
//   try {
//     const appointments = await appointmentModel.find({
//       userId: req.body.userId,
//     });
//     res.status(200).send({
//       success: true,
//       message: "Users' appointments fetched successfully",
//       data: appointments,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error in users' appointments",
//       error,
//     });
//   }
// };

module.exports = {
  loginController,
  registerController,
  authController,
  applyPatientController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllPatientsController,
};
