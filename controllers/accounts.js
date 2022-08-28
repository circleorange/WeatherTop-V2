"use strict";

const userStore = require("../models/user-store");
const logger = require("../utils/logger");
const uuid = require("uuid");

const accounts = {
  index(request, response) {
    const viewData = {
      title: "Home"
    };
    response.render("index", viewData);
  },

  settings(request, response) {
    logger.info("RENDER_SETTINGS_PAGE");
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: "Settings",
      user: loggedInUser
    };
    response.render("settings", viewData);
  },

  getCurrentUser(request) {
    const user = request.cookies.userCookie;
    return userStore.getUserById(user)
  },

  signIn(request, response) {
    const viewData = {
      title: "Sign In to WeatherTop"
    };
    response.render("sign-in", viewData);
  },

  signOut(request, response) {
    response.cookie("playlist", "");
    response.redirect("/");
  },

  signUp(request, response) {
    const viewData = {
      title: "Sing up to WeatherTop"
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
      response.cookie("userCookie", user.id);
      logger.info(`SIGNING_IN_AS: ${user.email}`);
      response.redirect("/dashboard");
    } else {
      response.redirect("/sign-in");
    }
  },

  updateUser(request, response) {
    logger.info("ACTION_UPDATE_MEMBER_PENDING");
    const loggedInUser = accounts.getCurrentUser(request);
    const updatedUser = {
      firstName: request.body.firstname,
      lastName: request.body.lastname,
      email: request.body.email,
      password: request.body.password
    }
    userStore.updateUser(loggedInUser, updatedUser);
    response.redirect("/settings");
  }
};

module.exports = accounts;