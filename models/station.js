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

  createStation(stationName) {
    this.model.add(this.collection, stationName);
    this.model.save();
  },

  deleteStation(stationId) {
    const station = this.getStationById(stationId);
    this.model.remove(this.collection, station);
    this.model.save();
  },

  createLatestReport(stations) {
    this.reportStore.removeAll(this.report);

    for (let i = 0; i < stations.length; i++) {
      let station = stations[i];
      let latestReadingOf = station["readings"][station["readings"].length - 1];
      let isEmpty = station["readings"].length === 0;

      const latestReadings = {
        name: station["name"],
        readings: {
          code: isEmpty ? "" : latestReadingOf["code"],
          tempCelsius: isEmpty ? "" : latestReadingOf["temperature"],
          tempFahrenheit: isEmpty ? "" : conversions.getFahrenheit(latestReadingOf["temperature"]),
          pressure: isEmpty ? "" : latestReadingOf["pressure"],

          windSpeed: isEmpty ? "" : latestReadingOf["windSpeed"],
          windDirection: isEmpty ? "" : latestReadingOf["windDirection"],

          windChill: isEmpty ? "" : conversions.getWindChill(latestReadingOf["temperature"], latestReadingOf["windSpeed"]),
          compassDirection: isEmpty ? "" : conversions.getCompassDirection(latestReadingOf["windDirection"]),
          beaufortReading: isEmpty ? "" : conversions.getBeaufortReading(latestReadingOf["windSpeed"]),
        }
      };

      this.reportStore.add(this.report, latestReadings);
      this.reportStore.save();
    }
    return this.getAllLatestReadings();
  },

  getAllLatestReadings() {
    return this.reportStore.findAll(this.report);
  },

  getLatestStationReport(name) {
    return this.reportStore.findOneBy(this.report, {name: name});
  },

};

Handlebars.registerHelper("getWeatherLabel", function(name) {
  let stationReport = station.getLatestStationReport(name);
  return conversions.getWeatherLabel(stationReport["readings"]["code"]);
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
