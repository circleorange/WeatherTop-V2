"use strict";

const logger = require("../utils/logger");
const stationCollection = require("../models/station-store");
const reportCollection = require("../models/report-store");
const uuid = require("uuid");
const axios = require("axios");


function getCurrentDate() {
  const now = new Date();
  const currentDate = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+' '
    +now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()+'.'+now.getMilliseconds();
  return currentDate;
}


const stationControl = {
  async index(request, response) {
    const stationId = request.params.id;
    logger.debug("OPEN_STATION_ID(" + stationId + ")");
    const currentStation = stationCollection.getStationById(stationId);
    let requestUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${currentStation.position.latitude}&lon=${currentStation.position.longitude}&appid=8ea5a0b42cda3244cb96f9241ac39025&units=metric`;
    const result = await axios.get(requestUrl);
    let report = {};
    if (result.status == 200) {
      report.trend = [];
      report.trendLabels = [];
      const trends = result.data.list;
      for (let i = 0; i < trends.length; i+=6) {
        report.trend.push(trends[i].main.temp);
        const date = new Date(trends[i].dt * 1000);
        report.trendLabels.push(`${date.getHours()}:00 ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`);
      }
    }
    const viewData = {
      title: "Station",
      trendCategory: "Temperature",
      station: currentStation,
      reading: report
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
  },

  async getReading(request, response) {
    logger.info("ACTION_GET_READING");
    const stationId = request.params.id;
    const stationName = stationCollection.getStationById(stationId).name;
    const requestUrl = `http://api.openweathermap.org/data/2.5/weather?q=${stationName},Ireland&units=metric&appid=8ea5a0b42cda3244cb96f9241ac39025`;
    const result = await axios.get(requestUrl);

    let report = {};
    if (result.status == 200) {
      const reading = result.data;
      report.id = uuid.v1();
      report.date = getCurrentDate();
      report.code = Math.round(reading.weather[0].id / 100) * 100;
      report.temperature = reading.main.temp;
      report.windSpeed = reading.wind.speed;
      report.pressure = reading.main.pressure;
      report.windDirection = reading.wind.deg;
    }
    stationCollection.createReading(stationId, report);
    let stations = stationCollection.getAllStations();
    reportCollection.createLatestReport(stations);
    response.redirect("/station/" + stationId);
  },

  async getSpeedChart(request, response) {
    const station = stationCollection.getStationById(request.params.id);
    let requestUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${station.position.latitude}&lon=${station.position.longitude}&appid=8ea5a0b42cda3244cb96f9241ac39025&units=metric`;
    const result = await axios.get(requestUrl);
    let report = {};
    if (result.status == 200) {
      report.trend = [];
      report.trendLabels = [];
      const trends = result.data.list;
      for (let i = 0; i < trends.length; i += 6) {
        report.trend.push(trends[i].wind.speed);
        const date = new Date(trends[i].dt * 1000);
        report.trendLabels.push(`${date.getHours()}:00 ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`);
      }
    }
    const viewData = {
      title: "Station",
      trendCategory: "Wind Speed",
      station: station,
      reading: report
    };
    response.render("station", viewData);
  },

  async getPressureChart(request, response) {
    const stationId = request.params.id;
    logger.debug("GET_SPEED_CHART");
    const currentStation = stationCollection.getStationById(stationId);
    let requestUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${currentStation.position.latitude}&lon=${currentStation.position.longitude}&appid=8ea5a0b42cda3244cb96f9241ac39025&units=metric`;
    const result = await axios.get(requestUrl);
    let report = {};
    if (result.status == 200) {
      report.trend = [];
      report.trendLabels = [];
      const trends = result.data.list;
      for (let i = 0; i < trends.length; i+=6) {
        report.trend.push(trends[i].main.pressure);
        const date = new Date(trends[i].dt * 1000);
        report.trendLabels.push(`${date.getHours()}:00 ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`);
      }
    }
    const viewData = {
      title: "Station",
      trendCategory: "Pressure",
      station: currentStation,
      reading: report
    };
    response.render("station", viewData);
  }
};

module.exports = stationControl;
