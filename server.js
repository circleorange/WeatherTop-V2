"use strict";

const express = require("express");
const logger = require("./utils/logger");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const app = express();
app.use(cookieParser());
const exphbs = require("express-handlebars");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(fileUpload());
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main"
  })
);
app.set("view engine", ".hbs");

const routes = require("./routes");
app.use("/", routes);

// Format the dates from seed data to remove "T" and "Z" characters from timestamp
const stationsCollection = require('./models/station-store');
const stations = stationsCollection.getAllStations();
for (let station of stations) {
  for (let reading of station.readings) {
    let date = reading.date;
    if (date.includes("T") || date.includes("Z")) {
      let formatDate = date.replace("T", " ").replace("Z", "");
      reading["date"] = formatDate;
      stationsCollection.store.save();
    }
  }
}

const listener = app.listen(process.env.PORT || 4000, function() {
  logger.info(`Server port: ${listener.address().port}`);
});
