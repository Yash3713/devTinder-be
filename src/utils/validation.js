const validator = require("validator");

const validateEditProfileData = (req) => {
  const ALLOWED_UPDATES = [
    "skills",
    "age",
    "firstName",
    "lastName",
    "about",
    "gender",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    ALLOWED_UPDATES.includes(field)
  );
  const { gender, skills } = req.body;
  if (gender && !["male", "female", "others"].includes(gender)) {
    throw new Error("Gender not Valid !");
  }
  if (skills) {
    if (!Array.isArray(skills)) {
      throw new Error("Invalid type");
    }
    if (skills.length > 5) {
      throw new Error("Maximum of 5 skills allowed");
    }
    if (skills.length < 0) {
      throw new Error("Minimum of 1 Skill Required ");
    }
    const hasDuplicates = new Set(skills).size != skills.length;
    if (hasDuplicates) {
      throw new Error("Skills must be unique");
    }
    const hasEmpty = skills.some((skill) => skill.trim() === "");
    if (hasEmpty) {
      throw new Error("Skill values cannot be empty");
    }
  }
  return isEditAllowed;
};

const validateEditProfilePassword = (req) => {
  const ALLOWED_UPDATES = ["password"];

  const isPasswordEditAllowed = Object.keys(req.body).every((field) =>
    ALLOWED_UPDATES.includes(field)
  );
  const { password } = req.body;
  if (!validator.isStrongPassword(password)) {
    throw new Error("Invalid Password ");
  }
  return isPasswordEditAllowed;
};

module.exports = {
  validateEditProfileData,
  validateEditProfilePassword,
};
