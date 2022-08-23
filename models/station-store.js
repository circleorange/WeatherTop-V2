"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");
const Handlebars = require("handlebars");
const conversions = require("../utils/conversions");
const reportCollection = require("./report-store");
const stationAnalytics = require("../utils/station-analytics");

const stationStore = {
  store: new JsonStore("./models/station-store.json", {
    stationCollection: []
  }),
  collection: "stationCollection",

  getAllStations() {
    return this.store.findAll(this.collection);
  },

  getStationById(id) {
    return this.store.findOneBy(this.collection, {id: id});
  },

  getStationsByUserId(userId) {
    return this.store.findBy(this.collection, {userId: userId});
  },

  createStation(stationName) {
    this.store.add(this.collection, stationName);
    this.store.save();
  },

  deleteStation(stationId) {
    const station = this.getStationById(stationId);
    this.store.remove(this.collection, station);
    this.store.save();
  },

  createReading(stationId, reading) {
    const station = this.getStationById(stationId);
    station.readings.push(reading);
    this.store.save();
  },

  deleteReading(stationId, readingId) {
    const station = this.getStationById(stationId);
    const readings = station.readings;
    _.remove(readings, {id: readingId});
    this.store.save();
  },

  createStationSummary(stations) {
    for (let station of stations) {
      let minMaxValues = {
        maxTemperature: stationAnalytics.getMaxTemp(station),
        minTemperature: stationAnalytics.getMinTemp(station),
        maxWind: stationAnalytics.getMaxWindSpeed(station),
        minWind: stationAnalytics.getMinWindSpeed(station),
        maxPressure: stationAnalytics.getMaxPressure(station),
        minPressure: stationAnalytics.getMinPressure(station)
      }

      let weatherTrends = {
        temperatureTrend: stationAnalytics.getTemperatureTrend(station),
        windTrend: stationAnalytics.getWindTrend(station),
        pressureTrend: stationAnalytics.getPressureTrend(station)
      }

      station["minMaxValues"] = minMaxValues;
      station["weatherTrends"] = weatherTrends;

      // Boolean check if station contains readings based on code field
      if (station["readings"].length === 0) {
        station["containsReadings"] = false;
      } else {
        station["containsReadings"] = true;
      }
    }
    return stations;
  }
};

Handlebars.registerHelper("getWeatherLabel", function(name) {
  let stationReport = reportCollection.getOneReportByName(name);
  return conversions.getWeatherLabel(stationReport["readings"]["code"]);
})

Handlebars.registerHelper("getTempCelsius", function(name) {
  let report = reportCollection.getOneReportByName(name);
  if (report["readings"]["tempCelsius"] == null) {return "";}
  else {return report["readings"]["tempCelsius"] + " C";}
})

Handlebars.registerHelper("getTempFahrenheit", function(name) {
  let report = reportCollection.getOneReportByName(name);
  if (report["readings"]["tempFahrenheit"] == null) {return "";}
  else {return report["readings"]["tempFahrenheit"] + " F";}
})

Handlebars.registerHelper("getBeaufortReading", function(name) {
  let report = reportCollection.getOneReportByName(name);
  if (report["readings"]["beaufortReading"] == null) {return "";}
  else {return report["readings"]["beaufortReading"] + " bft";}
})

Handlebars.registerHelper("getLatestPressure", function(name) {
  let report = reportCollection.getOneReportByName(name);
  if (report["readings"]["pressure"] == null) {return "";}
  else {return report["readings"]["pressure"] + " hPa";}
})

Handlebars.registerHelper("getCompassDirection", function(name) {
  let report = reportCollection.getOneReportByName(name);
  return report["readings"]["compassDirection"];
})

Handlebars.registerHelper("getBeaufortLabel", function(name) {
  let report = reportCollection.getOneReportByName(name);
  return conversions.getBeaufortLabel(report["readings"]["beaufortReading"]);
})

Handlebars.registerHelper("getWindChill", function(name) {
  let report = reportCollection.getOneReportByName(name);
  if (report["readings"]["windChill"] == null) {return "";}
  else {return (Math.round((report["readings"]["windChill"]) * 100) / 100) + " C";}
})

module.exports = stationStore;
