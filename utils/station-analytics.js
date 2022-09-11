"use strict";

const stationAnalytics = {
  getMaxTemp(station) {
    if (station.readings.length == 0) { return null; }
    let maxTemp = station.readings[0].temperature;
    for (let i = 0; i < station.readings.length; i++) {
      if (station.readings[i].temperature > maxTemp) {
        maxTemp = station.readings[i].temperature;
      }
    }
    return maxTemp;
  },

  getMinTemp(station) {
    if (station.readings.length == 0) { return null; }
    let minTemp = station.readings[0].temperature;
    for (let i = 0; i < station.readings.length; i++) {
      if (station.readings[i].temperature < minTemp) {
        minTemp = station.readings[i].temperature;
      }
    }
    return minTemp;
  },

  getMaxWindSpeed(station) {
    if (station.readings.length == 0) { return null; }
    let maxWindSpeed = station.readings[0].windSpeed;
    for (let i = 0; i < station.readings.length; i++) {
      if (station.readings[i].windSpeed > maxWindSpeed) {
        maxWindSpeed = station.readings[i].windSpeed;
      }
    }
    return maxWindSpeed;
  },

  getMinWindSpeed(station) {
    if (station.readings.length == 0) { return null; }
    let minWindSpeed = station.readings[0].windSpeed;
    for (let i = 0; i < station.readings.length; i++) {
      if (station.readings[i].windSpeed < minWindSpeed) {
        minWindSpeed = station.readings[i].windSpeed;
      }
    }
    return minWindSpeed;
  },

  getMaxPressure(station) {
    if (station.readings.length == 0) { return null; }
    let maxPressure = station.readings[0].pressure;
    for (let i = 0; i < station.readings.length; i++) {
      if (station.readings[i].pressure > maxPressure) {
        maxPressure = station.readings[i].pressure;
      }
    }
    return maxPressure;
  },

  getMinPressure(station) {
    if (station.readings.length == 0) { return null; }
    let minPressure = station.readings[0].pressure;
    for (let i = 0; i < station.readings.length; i++) {
      if (station.readings[i].pressure < minPressure) {
        minPressure = station.readings[i].pressure;
      }
    }
    return minPressure;
  },

  getTemperatureTrend(station) {
    if (station.readings.length < 3) { return "No Trend"; }
    else {
      let trendCounter = 0;
      for (let i = 1; i < 3; i++) {
        let temp = station.readings[station.readings.length - i].temperature;
        let tempPrev = station.readings[station.readings.length - 1 - i].temperature;

        if (temp > tempPrev) { trendCounter++; }
        if (temp < tempPrev) { trendCounter--; }
      }
      if (trendCounter == 2) { return "Trend: Increasing"; }
      else if (trendCounter == -2) { return  "Trend: Decreasing"; }
      else { return "No Trend"; }
    }
  },

  getWindTrend(station) {
    if (station.readings.length < 3) { return "No Trend"; }
    else {
      let trendCounter = 0;
      for (let i = 1; i < 3; i++) {
        let wind = station.readings[station.readings.length - i].windSpeed;
        let windPrev = station.readings[station.readings.length - 1 - i].windSpeed;

        if (wind > windPrev) { trendCounter++; }
        if (wind < windPrev) { trendCounter--; }
      }
      if (trendCounter == 2) { return "Trend: Increasing"; }
      else if (trendCounter == -2) { return  "Trend: Decreasing"; }
      else { return "No Trend"; }
    }
  },

  getPressureTrend(station) {
    if (station.readings.length < 3) { return "No Trend"; }
    else {
      let trendCounter = 0;
      for (let i = 1; i < 3; i++) {
        let pressure = station.readings[station.readings.length - i].pressure;
        let pressurePrev = station.readings[station.readings.length - 1 - i].pressure;

        if (pressure > pressurePrev) { trendCounter++; }
        if (pressure < pressurePrev) { trendCounter--; }
      }
      if (trendCounter == 2) { return "Trend: Increasing"; }
      else if (trendCounter == -2) { return  "Trend: Decreasing"; }
      else { return "No Trend"; }
    }
  },

  trendIcons: new Map([
    ['Trend: Increasing','green big angle double up icon'],
    ['Trend: Decreasing','red big angle double down icon']
    ]),

  weatherIcons: new Map ([
    [100,'yellow sun icon'],
    [200,'grey cloud icon'],
    [300,'grey cloud icon'],
    [400,'blue shower icon'],
    [500,'blue shower icon'],
    [600,'blue umbrella icon'],
    [700,'snowflake icon'],
    [800,'yellow bolt icon'],
  ])
};

module.exports = stationAnalytics;