const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAdminAuthoried = token === "xyz";
  if (!isAdminAuthoried) {
    res.status(401).send("Not Authorized ");
  } else {
    next();
  }
};

module.exports={
    adminAuth
}