"use strict";

const logger = require("../utils/logger");
const stationCollection = require("../models/station");

const dashboard = {
  index(request, response) {
    logger.info("RENDER_DASHBOARD");
    stationCollection.createLatestReport();
    const viewData = {
      title: "Dashboard",
      stations: stationCollection.getAllStations(),
    };
    response.render("dashboard", viewData);
  }
};

module.exports = dashboard;
