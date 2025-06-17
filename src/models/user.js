const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: String,
      maxLength: 20,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender not Valid !");
        }
      },
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      trim: true,
      validate: {
        validator: function (value) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/.test(value);
        },
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      },
    },
    skills: {
      type: [String],
      validate: {
        validator: function (value) {
          return value.length <= 5;
        },
        message: "Maximum Limit is 5",
      },
      validate: {
        validator: function (value) {
          const duplicates = value.filter(
            (i, index) => value.indexOf(i) !== index
          );
          return duplicates.length === 0;
        },
        message:"No Duplicates Allowed "
      },
    },
    about: {
      type: String,
      default: "Default Bio",
      minLength: 10,
      maxLength: 70,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
