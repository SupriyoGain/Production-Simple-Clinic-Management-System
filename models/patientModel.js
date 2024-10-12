const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    age: {
      type: Number,
      require: [true, "age is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },

    address: {
      type: String,
      required: [true, "Address is required"],
    },
    doctorname: {
      type: String,
      required: [true, "Doctor's name is required"],
    },
    status: {
      type: String,
      default: "pending",
    },
    timings: {
      type: Object,
      required: [true, "Visiting time is required"],
    },
  },
  { timestamps: true }
);

const patientModel = mongoose.model("patients", patientSchema);

module.exports = patientModel;
