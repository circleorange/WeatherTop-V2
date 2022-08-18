"use strict";

const logger = require("../utils/logger");
const stationCollection = require("../models/station-store");
const reportCollection = require("../models/report-store");
const uuid = require("uuid");

const dashboard = {
  index(request, response) {
    logger.info("RENDER_DASHBOARD");
    let stations = stationCollection.getAllStations();
    const viewData = {
      title: "Dashboard",
      stations: stations,
      latestReadings: reportCollection.createLatestReport(stations)
    };
    response.render("dashboard", viewData);
  },

  createStation(request, response) {
    logger.info("ACTION_CREATE_STATION");
    const newStation = {
      id: uuid.v1(),
      name: request.body.name,
      position: {
        latitude: request.body.latitude,
        longitude: request.body.longitude,
      },
      readings: [],
    };
    stationCollection.createStation(newStation);
    response.redirect("/dashboard");
  },

  deleteStation(request, response) {
    logger.info("ACTION_DELETE_STATION");
    const stationId = request.params.id;
    stationCollection.deleteStation(stationId);
    response.redirect("/dashboard");
  }
};

module.exports = dashboard;
