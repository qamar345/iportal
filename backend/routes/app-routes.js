const express = require("express");
const { RegisterInterns } = require("../controller/intern/interns-controller");
const {
  HrAuth,
  HrForgotPassword,
  HrAvatar,
} = require("../controller/hr/hr-auth-controller");
const {
  AssignTest,
  RemoveIntern,
  GetTestComplete,
} = require("../controller/hr/hr-interview-controller");
const {
  GetLatestRegister,
  GetOnsiteInterview,
  GetRemoteInterview,
  GetTestIntern,
} = require("../controller/hr/get-interns-controller");
const {
  GetManagerOnsite,
  GetManagerRemote,
  OnsiteSingle,
  RemoteSingle,
  CountOnsite,
  GetInternsEmail,
} = require("../controller/manager/get-manager-interns");
const {
  AssignProject,
} = require("../controller/manager/assignproject-controller");
const {
  AssignPortal,
  ActivePortal,
} = require("../controller/manager/assignPortal-controller");
const {
  StartShift,
  EndShift,
  CurrentShift,
  GetInternAttendance,
} = require("../controller/intern/internAttendance-controller");
const { InternAuth } = require("../controller/intern/internAuth-controller");
const jwt = require("jsonwebtoken");
const {
  GetTask,
  MarkTaskComplete,
} = require("../controller/intern/internTest-controller");
const dotenv = require("dotenv").config();
const router = express.Router();
const secretKey = process.env.SECRETKEY;

/* Middleware to verify token */
function verifyToken(req, res, next) {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.json({ tokenMessage: "Token not provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.json({ authMessage: "Failed to authenticate token" });
    }

    req.internEmail = decoded.email;
    next();
  });
}

router.get("/", (req, res) => {
  res.send("Hello from NodeJs Server");
});

/* Interns Endpoints */
router.post("/register-inters", RegisterInterns);
router.post("/intern-auth", InternAuth);
router.post("/start-shift", verifyToken, StartShift);
router.post("/end-shift", verifyToken, EndShift);
router.get("/current-shift/:email", verifyToken, CurrentShift);
router.post("/intern-test", verifyToken, GetTask);
router.get("/get-intern-attendance", verifyToken, GetInternAttendance);
router.post("/mark-test-complete", verifyToken, MarkTaskComplete);

/* Manager Auth Endpoints */
router.post("/manager-auth", HrAuth);
// router.post("/manager-avatar", ManagerAvatar);
// router.post("/manager-forgot-password", ManagerForgotPassword);

/* HR Endpoints */
router.get("/get-latest-interns", GetLatestRegister);
router.get("/get-onsite-interns", GetOnsiteInterview);
router.post("/update-intern-status", AssignTest);
router.post("/remove-intern", RemoveIntern);
router.get("/get-remote-interns", GetRemoteInterview);
router.get("/get-test-interns", GetTestIntern);
router.post("/active-portal", ActivePortal);
router.get("/get-test-complete", GetTestComplete);

/* Manager Endpoints */
router.get("/get-manager-onsite", GetManagerOnsite);
router.get("/get-manager-remote", GetManagerRemote);
router.post("/single-onsite", OnsiteSingle);
router.post("/single-remote", RemoteSingle);
router.post("/get-emails", GetInternsEmail);

/* Assign Portal Endpoint */
router.post("/assign-portal", AssignPortal);

/* Assign Project Endpoints */
router.post("/assign-project", AssignProject);

/* Testing Area */
// router.get("/count-onsite", CountOnsite);
module.exports = router;