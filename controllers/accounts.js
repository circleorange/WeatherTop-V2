"use strict";

const userStore = require("../models/user-store");
const logger = require("../utils/logger");
const uuid = require("uuid");

const accounts = {
  index(request, response) {
    const viewData = {
      title: "Login or Signup"
    };
    response.render("index", viewData);
  },

  signIn(request, response) {
    const viewData = {
      title: "Login to the Service"
    };
    response.render("sign-in", viewData);
  },

  signOut(request, response) {
    response.cookie("playlist", "");
    response.redirect("/");
  },

  signUp(request, response) {
    const viewData = {
      title: "Login to the Service"
    };
    response.render("sign-up", viewData);
  },

  register(request, response) {
    const user = request.body;
    user.id = uuid.v1();
    userStore.addUser(user);
    logger.info(`REGISTERING_USER: ${user.email}`);
    response.redirect("/");
  },

  authenticate(request, response) {
    const user = userStore.getUserByEmail(request.body.email);
    if (user) {
      response.cookie("playlist", user.email);
      logger.info(`SIGNING_IN_AS: ${user.email}`);
      response.redirect("/dashboard");
    } else {
      response.redirect("/sign-in");
    }
  },

  getCurrentUser(request) {
    const userEmail = request.cookies.playlist;
    return userStore.getUserByEmail(userEmail);
  }
};

module.exports = accounts;