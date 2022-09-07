"use strict";

const logger = require("../utils/logger");

const about = {
  index(request, response) {
    logger.info("RENDER_ABOUT_START");
    const viewData = {
      title: "About"
    };
    response.render("about", viewData);
    logger.info("RENDER_ABOUT_FINISHED");
  }
};

module.exports = about;
