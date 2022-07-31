"use strict";

const logger = require("../utils/logger");
const stationCollection = require("../models/station");

const stationControl = {
  index(request, response) {
    const stationId = request.params.id;
    logger.debug("OPEN_STATION_ID(" + stationId + ")");
    const viewData = {
      title: "Station",
      station: stationCollection.getStationById(stationId),
    };
    response.render("station", viewData);
  },
};

module.exports = stationControl;
