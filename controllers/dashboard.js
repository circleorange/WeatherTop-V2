"use strict";

const logger = require("../utils/logger");
const stationStore = require("../models/station-store");
const reportStore = require("../models/report-store");
const accounts = require("./accounts.js");
const uuid = require("uuid");

const dashboard = {
  index(request, response) {
    logger.info("RENDER_DASHBOARD");
    const loggedInUser = accounts.getCurrentUser(request);
    const userStations = stationStore.getStationsByUserId(loggedInUser.id);
    const viewData = {
      title: "Dashboard",
      stations: userStations,
      latestReadings: reportStore.createLatestReport(userStations),
      stationSummary: stationStore.createStationSummary(userStations)
    };
    response.render("dashboard", viewData);
  },

  createStation(request, response) {
    logger.info("ACTION_CREATE_STATION");
    const loggedInUser = accounts.getCurrentUser(request);
    const newStation = {
      id: uuid.v1(),
      userId: loggedInUser.id,
      name: request.body.name,
      position: {
        latitude: request.body.latitude,
        longitude: request.body.longitude,
      },
      readings: [],
    };
    stationStore.createStation(newStation);
    response.redirect("/dashboard");
  },

  deleteStation(request, response) {
    logger.info("ACTION_DELETE_STATION");
    const stationId = request.params.id;
    stationStore.deleteStation(stationId);
    response.redirect("/dashboard");
  }
};

module.exports = dashboard;
