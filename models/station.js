"use strict";

const _ = require("lodash");
const Json = require("./json");
const Handlebars = require("handlebars");
const conversions = require("../utils/conversions");

const station = {
  model: new Json("./models/data-seed.json", {
    stationCollection: []
  }),
  collection: "stationCollection",

  reportStore: new Json("./models/latest-report.json", {
    latestReport: []
  }),
  report: "latestReport",

  getAllStations() {
    return this.model.findAll(this.collection);
  },

  getStationById(id) {
    return this.model.findOneBy(this.collection, {id: id});
  },

  createLatestReport() {
    this.reportStore.removeAll(this.report);
    const stations = this.model.findAll(this.collection);
    let latestReadingOf = null;

    for (let i = 0; i < stations.length; i++) {
      let station = stations[i];
      latestReadingOf = station["readings"][station["readings"].length - 1];

      const latestReport = {
        name: station["name"],
        readings: {
          code: latestReadingOf["code"],
          tempCelsius: latestReadingOf["temperature"],
          tempFahrenheit: conversions.getFahrenheit(latestReadingOf["temperature"]),
          pressure: latestReadingOf["pressure"],

          windSpeed: latestReadingOf["windSpeed"],
          windDirection: latestReadingOf["windDirection"],
          windChill: conversions.getWindChill(latestReadingOf["temperature"], latestReadingOf["windSpeed"]),
          compassDirection: conversions.getCompassDirection(latestReadingOf["windDirection"]),

          beaufortReading: conversions.getBeaufortReading(latestReadingOf["windSpeed"]),
        }
      };

      this.reportStore.add(this.report, latestReport);
      this.reportStore.save();
    }
  },

  getAllLatestReadings() {
    return this.reportStore.findAll(this.report);
  },

  getLatestStationReport(name) {
    return this.reportStore.findOneBy(this.report, {name: name});
  }
};

Handlebars.registerHelper("getWeatherLabel", function(name) {
  let report = station.getLatestStationReport(name);
  return conversions.getWeatherLabel(report["readings"]["code"]);
})

Handlebars.registerHelper("getTempCelsius", function(name) {
  let report = station.getLatestStationReport(name);
  return report["readings"]["tempCelsius"];
})

Handlebars.registerHelper("getTempFahrenheit", function(name) {
  let report = station.getLatestStationReport(name);
  return report["readings"]["tempFahrenheit"];
})

Handlebars.registerHelper("getBeaufortReading", function(name) {
  let report = station.getLatestStationReport(name);
  return report["readings"]["beaufortReading"];
})

Handlebars.registerHelper("getLatestPressure", function(name) {
  let report = station.getLatestStationReport(name);
  return report["readings"]["pressure"];
})

Handlebars.registerHelper("getCompassDirection", function(name) {
  let report = station.getLatestStationReport(name);
  return report["readings"]["compassDirection"];
})

Handlebars.registerHelper("getBeaufortLabel", function(name) {
  let report = station.getLatestStationReport(name);
  return conversions.getBeaufortLabel(report["readings"]["beaufortReading"]);
})

Handlebars.registerHelper("getWindChill", function(name) {
  let report = station.getLatestStationReport(name);
  return Math.round((report["readings"]["windChill"]) * 100) / 100;
})

module.exports = station;
