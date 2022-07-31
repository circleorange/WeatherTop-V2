"use strict";

const express = require("express");
const router = express.Router();

const dashboard = require("./controllers/dashboard.js");
const about = require("./controllers/about.js");
const stationControl = require("./controllers/station-control");

router.get("/", dashboard.index);
router.get("/dashboard", dashboard.index);
router.get("/about", about.index);

router.get("/station/:id", stationControl.index);
router.post("/dashboard/add-station", dashboard.createStation);
router.get("/dashboard/delete-station/:id", dashboard.deleteStation);

module.exports = router;
