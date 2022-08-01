"use strict";

const logger = require("../utils/logger");
const stationCollection = require("../models/station");
const uuid = require("uuid");

const stationControl = {
  index(request, response) {
    const stationId = request.params.id;
    logger.debug("OPEN_STATION_ID(" + stationId + ")");
    const viewData = {
      title: "Station",
      station: stationCollection.getStationById(stationId),
    };
    response.render("station", viewData);
  },

  createReading(request, response) {
    logger.info("ACTION_CREATE_READING");
    const stationId = request.params.id;
    const newReading = {
      id: uuid.v1(),
      code: request.body.code,
      temperature: request.body.tempCelsius,
      windSpeed: request.body.speed,
      windDirection: request.body.direction,
      pressure: request.body.pressure
    };
    stationCollection.createReading(stationId, newReading);
    let stations = stationCollection.getAllStations();
    stationCollection.createLatestReport(stations);
    response.redirect("/station/" + stationId);
  },

  deleteReading(request, response) {
    logger.info("ACTION_DELETE_READING");
    const stationId = request.params.id;
    const readingId = request.params.readingId;
    stationCollection.deleteReading(stationId, readingId);
    let stations = stationCollection.getAllStations();
    stationCollection.createLatestReport(stations);
    response.redirect("/station/" + stationId);
  }
};

module.exports = stationControl;
