"use strict";

const _ = require("lodash");
const Json = require("./json-store");
const conversions = require("../utils/conversions");

const reportStore = {
  reportStore: new Json("./models/report-store.json", {
    latestReport: []
  }),
  report: "latestReport",

  createLatestReport(stations) {
    this.reportStore.removeAll(this.report);

    // 'for in' loops over numbers but 'for of' loops over objects
    for (let station of stations) {
      let lastReading = station["readings"][station["readings"].length - 1];
      let isEmpty = station["readings"].length === 0;

      const latestReadings = {
        name: station["name"],
        readings: {
          code: isEmpty ? null : lastReading["code"],
          tempCelsius: isEmpty ? null : lastReading["temperature"],
          tempFahrenheit: isEmpty ? null : conversions.getFahrenheit(lastReading["temperature"]),
          pressure: isEmpty ? null : lastReading["pressure"],

          windSpeed: isEmpty ? null : lastReading["windSpeed"],
          windDirection: isEmpty ? null : lastReading["windDirection"],

          windChill: isEmpty ? null : conversions.getWindChill(lastReading["temperature"], lastReading["windSpeed"]),
          compassDirection: isEmpty ? null : conversions.getCompassDirection(lastReading["windDirection"]),
          beaufortReading: isEmpty ? null : conversions.getBeaufortReading(lastReading["windSpeed"]),
        }
      };

      this.reportStore.add(this.report, latestReadings);
      this.reportStore.save();
    }
    return this.getAllReports();
  },

  getAllReports() {
    return this.reportStore.findAll(this.report);
  },

  getReportByName(stationName) {
    return this.reportStore.findOneBy(this.report, {name: stationName});
  },
}

module.exports = reportStore;