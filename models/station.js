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

    for (let i = 0; i < stations.length; i++) {
      let station = stations[i];

      const latestReport = {
        name: station["name"],
        readings: {
          code: station["readings"][station["readings"].length - 1]["code"],
          temperature: station["readings"][station["readings"].length - 1]["temperature"],
          windSpeed: station["readings"][station["readings"].length - 1]["windSpeed"],
          pressure: station["readings"][station["readings"].length - 1]["pressure"],
        }
      };

      this.reportStore.add(this.report, latestReport);
      this.reportStore.save();
    }
  },

  getLatestReport() {
    return this.reportStore.findAll(this.report);
  }
};

Handlebars.registerHelper("latestCode", function() {
  return conversions.getWeatherLabel(this.readings[this.readings.length - 1]["code"]);
})

Handlebars.registerHelper("latestTemperature", function() {
  let tempC = this.readings[this.readings.length - 1]["temperature"];
  let tempF = conversions.getFahrenheit(tempC);
  return tempC + "C" + " / " + tempF + "F";
})

Handlebars.registerHelper("latestBeaufortReading", function() {
  return conversions.getBeaufortReading(this.readings[this.readings.length - 1]["windSpeed"]);
})

Handlebars.registerHelper("latestPressure", function() {
  return this.readings[this.readings.length - 1]["pressure"];
})

module.exports = station;
