const patientModel = require("../models/patientModel");
const userModel = require("../models/userModels");
const getPatientInfoController = async (req, res) => {
  try {
    const patient = await patientModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Patient's data fetched successfully",
      data: patient,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in fetching patient's details",
    });
  }
};

const updateProfileController = async (req, res) => {
  try {
    const patient = await patientModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Patient's profile updated",
      data: patient,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Patient's profile updation issue",
      error,
    });
  }
};

// const getPatientByIdController = async (req, res) => {
//   try {
//     const patient = await patientModel.findOne({ _id: req.body.patientId });
//     res.status(201).send({
//       success: true,
//       message: "Single patient's info fetched",
//       data: patient,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error in single patient's info",
//       error,
//     });
//   }
// };

// const patientAppointmentsController = async (req, res) => {
//   try {
//     const patient = await patientModel.findOne({ userId: req.body.userId });
//     const appointments = await appointmentModel.find({
//       patientId: patient._id,
//     });
//     res.status(200).send({
//       success: true,
//       message: "Patients' appointments fetched successfully",
//       data: appointments,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error in patients' appointments",
//       error,
//     });
//   }
// };

// const updateStatusController = async (req, res) => {
//   try {
//     const { appointmentsId, status } = req.body;
//     const appointments = await appointmentModel.findByIdAndUpdate(
//       appointmentsId,
//       { status }
//     );
//     const user = await userModel.findOne({ _id: appointments.userId });
//     const notification = user.notification;
//     notification.push({
//       type: "status-updated",
//       message: `Your appointment has been updated ${status}`,
//       onClickPath: "/patient-appointments",
//     });
//     await user.save();
//     res.status(200).send({
//       success: true,
//       message: "Appointment's status updated",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error in updating status",
//       error,
//     });
//   }
// };

module.exports = {
  getPatientInfoController,
  updateProfileController,
};
