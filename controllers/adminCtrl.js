const patientModel = require("../models/patientModel");
const userModel = require("../models/userModels");

const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "Fetched users data successfully",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching users' data",
      error,
    });
  }
};

const getAllPatientsController = async (req, res) => {
  try {
    const patients = await patientModel.find({});
    res.status(200).send({
      success: true,
      message: "Fetched patients data successfully",
      data: patients,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching patients' data",
      error,
    });
  }
};

const changeAccountStatusController = async (req, res) => {
  try {
    const { patientId, status } = req.body;
    const patient = await patientModel.findByIdAndUpdate(patientId, { status });
    const user = await userModel.findOne({ _id: patient.userId });
    const notification = user.notification;
    notification.push({
      type: "patient-account-request-updated",
      message: `Your patient account request has been ${status}`,
      onClickPath: "/notification",
    });
    user.isPatient = status === "approved" ? true : false;
    await user.save();
    res.status(201).send({
      success: true,
      message: "Account Status Updated",
      data: patient,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in account's status",
      error,
    });
  }
};

module.exports = {
  getAllPatientsController,
  getAllUsersController,
  changeAccountStatusController,
};
