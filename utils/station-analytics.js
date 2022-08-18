"use strict";

const stationAnalytics = {
  getMaxTemp(station) {
    if (station.readings.length == 0) {
      return null;
    }
    let maxTemp = station.readings[0].temperature;
    for (let i = 0; i < station.readings.length; i++) {
      if (station.readings[i].temperature > maxTemp) {
        maxTemp = station.readings[i].temperature;
      }
    }
    return maxTemp;
  },

  getMinTemp(station) {
    if (station.readings.length == 0) {
      return null;
    }
    let minTemp = station.readings[0].temperature;
    for (let i = 0; i < station.readings.length; i++) {
      if (station.readings[i].temperature < minTemp) {
        minTemp = station.readings[i].temperature;
      }
    }
    return minTemp;
  },

  getMaxWindSpeed(station) {
    if (station.readings.length == 0) {
      return null;
    }
    let maxWindSpeed = station.readings[0].windSpeed;
    for (let i = 0; i < station.readings.length; i++) {
      if (station.readings[i].windSpeed > maxWindSpeed) {
        maxWindSpeed = station.readings[i].windSpeed;
      }
    }
    return maxWindSpeed;
  },

  getMinWindSpeed(station) {
    if (station.readings.length == 0) {
      return null;
    }
    let minWindSpeed = station.readings[0].windSpeed;
    for (let i = 0; i < station.readings.length; i++) {
      if (station.readings[i].windSpeed < minWindSpeed) {
        minWindSpeed = station.readings[i].windSpeed;
      }
    }
    return minWindSpeed;
  },

  getMaxPressure(station) {
    if (station.readings.length == 0) {
      return null;
    }
    let maxPressure = station.readings[0].pressure;
    for (let i = 0; i < station.readings.length; i++) {
      if (station.readings[i].pressure > maxPressure) {
        maxPressure = station.readings[i].pressure;
      }
    }
    return maxPressure;
  },

  getMinPressure(station) {
    if (station.readings.length == 0) {
      return null;
    }
    let minPressure = station.readings[0].pressure;
    for (let i = 0; i < station.readings.length; i++) {
      if (station.readings[i].pressure < minPressure) {
        minPressure = station.readings[i].pressure;
      }
    }
    return minPressure;
  },
};

module.exports = stationAnalytics;