"use strict";

const logger = require("../utils/logger");
const stationCollections = require("../models/station");

const dashboard = {
  index(request, response) {
    logger.info("RENDER_DASHBOARD");
    stationCollections.createLatestReport()
    const viewData = {
      title: "Dashboard",
      stations: stationCollections.getAllStations(),
    };
    response.render("dashboard", viewData);
  }
};

module.exports = dashboard;
