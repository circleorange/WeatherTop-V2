"use strict";

const express = require("express");
const router = express.Router();

const accounts = require("./controllers/accounts.js");
const dashboard = require("./controllers/dashboard.js");
const about = require("./controllers/about.js");
const stationControl = require("./controllers/station-control");

router.get("/", accounts.index);
router.get("/settings", accounts.settings);
router.get("/sign-in", accounts.signIn);
router.get("/sign-up", accounts.signUp);
router.get("/sign-out", accounts.signOut);
router.post("/register", accounts.register);
router.post("/authenticate", accounts.authenticate);
router.post("/settings/save", accounts.updateUser);

router.get("/dashboard", dashboard.index);
router.get("/about", about.index);

router.get("/station/:id", stationControl.index);
router.post("/dashboard/create-station", dashboard.createStation);
router.get("/dashboard/delete-station/:id", dashboard.deleteStation);

router.post("/station/:id/create-reading", stationControl.createReading);
router.get("/station/:id/delete-reading/:readingId", stationControl.deleteReading);
router.get("/station/:id/get-reading", stationControl.getReading);

module.exports = router;
