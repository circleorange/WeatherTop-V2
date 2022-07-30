"use strict";

const conversions = {
  getWeatherLabel(code) {
    if (code == 100) {return "Clear";}
    else if (code == 200) {return "Partial Clouds";}
    else if (code == 300) {return "Cloudy";}
    else if (code == 400) {return "Light Showers";}
    else if (code == 500) {return "Heavy Showers";}
    else if (code == 600) {return "Rain";}
    else if (code == 700) {return "Snow";}
    else if (code == 800) {return "Thunder";}
    else {return "INVALID_WEATHER_CODE";}
  },

  getFahrenheit(celsius) {
    return celsius * (9/5) + 32;
  },

  getBeaufortReading(speed) {
    if (speed == 1) { return 1; }
    else if (speed > 1 && speed <= 5) { return 1; }
    else if (speed >= 6 && speed <= 11) { return 2; }
    else if (speed >= 12 && speed <= 19) { return 3; }
    else if (speed >= 20 && speed <= 28) { return 4; }
    else if (speed >= 29 && speed <= 38) { return 5; }
    else if (speed >= 39 && speed <= 49) { return 6; }
    else if (speed >= 50 && speed <= 61) { return 7; }
    else if (speed >= 62 && speed <= 74) { return 8; }
    else if (speed >= 75 && speed <= 88) { return 9; }
    else if (speed >= 89 && speed <= 102) { return 10; }
    else if (speed >= 103 && speed <= 117) { return 11; }
    else { return "INVALID_BEAUFORT_SCALE"; }
  },

  getBeaufortLabel(beaufortReading) {
    if (beaufortReading  == 0) { return "Calm"; }
    else if (beaufortReading  == 1) { return "Light Air"; }
    else if (beaufortReading  == 2) { return "Light Breeze"; }
    else if (beaufortReading  == 3) { return "Gentle Breeze"; }
    else if (beaufortReading  == 4) { return "Moderate Breeze"; }
    else if (beaufortReading  == 5) { return "Fresh Breeze"; }
    else if (beaufortReading  == 6) { return "Strong Breeze"; }
    else if (beaufortReading  == 7) { return "Near Gale"; }
    else if (beaufortReading  == 8) { return "Gale"; }
    else if (beaufortReading  == 9) { return "Severe Gale"; }
    else if (beaufortReading  == 10) { return "Strong storm"; }
    else if (beaufortReading  == 11) { return "Violent Storm"; }
    else { return "OUT_OF_RANGE_BEAUFORT_SCALE"; }
  },

  getCompassDirection(degrees) {
    if (degrees > 348.75 && degrees <= 11.25) { return "N"; }
    else if (degrees > 11.25 && degrees <= 33.75) { return "NNE"; }
    else if (degrees > 33.75 && degrees <= 56.25) { return "NE"; }
    else if (degrees > 56.25 && degrees <= 78.75) { return "ENE"; }
    else if (degrees > 75.75 && degrees <= 101.25) { return "E"; }
    else if (degrees > 101.25 && degrees <= 123.75) { return "ESE"; }
    else if (degrees > 123.75 && degrees <= 146.25) { return "SE"; }
    else if (degrees > 146.25 && degrees <= 168.75) { return "SSE"; }
    else if (degrees > 168.75 && degrees <= 191.25) { return "S"; }
    else if (degrees > 191.25 && degrees <= 213.75) { return "SSW"; }
    else if (degrees > 213.75 && degrees <= 236.25) { return "SW"; }
    else if (degrees > 236.25 && degrees <= 258.75) { return "WSW"; }
    else if (degrees > 258.75 && degrees <= 281.25) { return "W"; }
    else if (degrees > 281.25 && degrees <= 303.75) { return "WNW"; }
    else if (degrees > 303.75 && degrees <= 326.25) { return "NW"; }
    else if (degrees > 326.25 && degrees <= 348.75) { return "NNW"; }
    else { return "INVALID_COMPASS_DIRECTION"; }
  },

  getWindFeel(celsius, speed) {
    return 13.12 + 0.6215*celsius - 11.37*(Math.pow(speed, 0.16)) + 0.3965*celsius*(Math.pow(speed, 0.16));
  }
}

module.exports = conversions;