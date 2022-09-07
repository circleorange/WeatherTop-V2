"use strict";

const logger = require("../utils/logger");
const stationStore = require("../models/station-store");
const reportStore = require("../models/report-store");
const accounts = require("./accounts.js");
const uuid = require("uuid");
const axios = require("axios");


const dashboard = {
  index(request, response) {
    logger.info("RENDER_DASHBOARD_START");
    const loggedInUser = accounts.getCurrentUser(request);
    const userStations = stationStore.getStationsByUserId(loggedInUser.id);
    const viewData = {
      title: "Dashboard",
      stations: userStations,
      latestReadings: reportStore.createLatestReport(userStations),
      stationSummary: stationStore.createStationSummary(userStations)
    };
    response.render("dashboard", viewData);
    logger.info("RENDER_DASHBOARD_FINISHED");
  },

  createStation(request, response) {
    logger.info("CREATE_STATION_START");
    if (!request.body.name == "") {
      logger.info("CREATE_STATION_CHECK_PASS");
      const loggedInUser = accounts.getCurrentUser(request);
      const newStation = {
        id: uuid.v1(),
        userId: loggedInUser.id,
        name: request.body.name,
        position: {
          latitude: parseFloat(request.body.latitude).toFixed(4),
          longitude: parseFloat(request.body.longitude).toFixed(4),
        },
        readings: [],
      };
      stationStore.createStation(newStation);
    }
    response.redirect("/dashboard");
    logger.info("CREATE_STATION_FINISHED");
  },

  deleteStation(request, response) {
    logger.info("DELETE_STATION_START");
    const stationId = request.params.id;
    stationStore.deleteStation(stationId);
    response.redirect("/dashboard");
    logger.info("DELETE_STATION_FINISHED");
  },

  async fetchStationCoordinates(request, response) {
    logger.info("FETCH_COORDINATES_START");
    try {
      const station = stationStore.getStationById(request.params.id);
      let requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${station.name},Ireland&units=metric&appid=8ea5a0b42cda3244cb96f9241ac39025`;
      const result = await axios.get(requestUrl);
      if (result.status == 200) {
        logger.info("FETCH_COORDINATES_CHECK_PASS");
        const reading = result.data;
        station.position.latitude = parseFloat(reading[0].lat).toFixed(4);
        station.position.longitude = parseFloat(reading[0].lon).toFixed(4);
        stationStore.store.save();
      } else {logger.info("FETCH_COORDINATES_CHECK_FAILED");}
      response.redirect("/dashboard");
      logger.info("FETCH_COORDINATES_FINISHED");
    }
    catch(err) {
      logger.info("FETCH_COORDINATES_ERROR");
      response.redirect("/dashboard");
    }
  },

  getViewData(request, response) {
    logger.info("GET_VIEW_DATA_START");
    const loggedInUser = accounts.getCurrentUser(request);
    const userStations = stationStore.getStationsByUserId(loggedInUser.id);
    const viewData = {
      title: "Dashboard",
      stations: userStations,
      latestReadings: reportStore.createLatestReport(userStations),
      stationSummary: stationStore.createStationSummary(userStations)
    };
    logger.info("GET_VIEW_DATA_FINISHED");
    return viewData;
  }
};

module.exports = dashboard;
