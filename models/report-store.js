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

    for (let i = 0; i < stations.length; i++) {
      let station = stations[i];
      let latestReadingOf = station["readings"][station["readings"].length - 1];
      let isEmpty = station["readings"].length === 0;

      const latestReadings = {
        name: station["name"],
        readings: {
          code: isEmpty ? null : latestReadingOf["code"],
          tempCelsius: isEmpty ? null : latestReadingOf["temperature"],
          tempFahrenheit: isEmpty ? null : conversions.getFahrenheit(latestReadingOf["temperature"]),
          pressure: isEmpty ? null : latestReadingOf["pressure"],

          windSpeed: isEmpty ? null : latestReadingOf["windSpeed"],
          windDirection: isEmpty ? null : latestReadingOf["windDirection"],

          windChill: isEmpty ? null : conversions.getWindChill(latestReadingOf["temperature"], latestReadingOf["windSpeed"]),
          compassDirection: isEmpty ? null : conversions.getCompassDirection(latestReadingOf["windDirection"]),
          beaufortReading: isEmpty ? null : conversions.getBeaufortReading(latestReadingOf["windSpeed"]),
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

  getOneReportByName(stationName) {
    return this.reportStore.findOneBy(this.report, {name: stationName});
  },
}

module.exports = reportStore;