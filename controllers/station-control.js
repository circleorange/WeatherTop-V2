"use strict";

const logger = require("../utils/logger");
const stationCollection = require("../models/station-store");
const reportCollection = require("../models/report-store");
const stationAnalytics = require("../utils/station-analytics");
const uuid = require("uuid");

function getCurrentDate() {
  const now = new Date();
  const currentDate = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+' '
    +now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()+'.'+now.getMilliseconds();
  return currentDate;
}

const stationControl = {
  index(request, response) {
    const stationId = request.params.id;
    logger.debug("OPEN_STATION_ID(" + stationId + ")");
    const currStation = stationCollection.getStationById(stationId);
    const viewData = {
      title: "Station",
      station: currStation,
    };
    response.render("station", viewData);
  },

  createReading(request, response) {
    logger.info("ACTION_CREATE_READING");
    const stationId = request.params.id;
    const newReading = {
      id: uuid.v1(),
      date: getCurrentDate(),
      code: request.body.code,
      temperature: request.body.tempCelsius,
      windSpeed: request.body.speed,
      windDirection: request.body.direction,
      pressure: request.body.pressure
    };
    stationCollection.createReading(stationId, newReading);
    let stations = stationCollection.getAllStations();
    reportCollection.createLatestReport(stations);
    response.redirect("/station/" + stationId);
  },

  deleteReading(request, response) {
    logger.info("ACTION_DELETE_READING");
    const stationId = request.params.id;
    const readingId = request.params.readingId;
    stationCollection.deleteReading(stationId, readingId);
    let stations = stationCollection.getAllStations();
    reportCollection.createLatestReport(stations);
    response.redirect("/station/" + stationId);
  }
};

module.exports = stationControl;
