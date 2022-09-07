"use strict";

const userStore = require("../models/user-store");
const logger = require("../utils/logger");
const uuid = require("uuid")

const accounts = {
  index(request, response) {
    const viewData = { title: "Home" };
    response.render("index", viewData);
  },

  settings(request, response) {
    logger.info("RENDER_SETTINGS_PAGE_START");
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: "Settings",
      user: loggedInUser
    };
    response.render("settings", viewData);
    logger.info("RENDER_SETTINGS_PAGE_FINISHED");
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
    response.cookie("userCookie", "");
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
    logger.info("AUTHENTICATION_START");
    const user = userStore.getUserByEmail(request.body.email);
    if (userStore.checkPassword(user.email, request.body.password)) {
      logger.info("AUTHENTICATION_CHECK_PASS");
      response.cookie("userCookie", user.id);
      logger.info(`SIGNING_IN_AS: ${user.email}`);
      response.redirect("/dashboard");
    } else {
      const viewData = {
        title: "Login failed",
        authenticationFailed: true
      };
      response.render("sign-in", viewData);
      logger.info("AUTHENTICATION_CHECK_FAILED");
    }
    logger.info("AUTHENTICATION_FINISHED");
  },

  updateUser(request, response) {
    logger.info("UPDATE_MEMBER_START");
    const loggedInUser = accounts.getCurrentUser(request);
    const firstname = request.body.firstname;
    const lastname = request.body.lastname;
    const email = request.body.email;
    const password = request.body.password;
    let updatedUser = {
      firstName: loggedInUser.firstName,
      lastName: loggedInUser.lastName,
      email: loggedInUser.email,
      password: loggedInUser.password
    };
    if (!firstname == "" && !lastname == "" && !email == "" && !password == "") {
      updatedUser.firstName = firstname;
      updatedUser.lastName = lastname;
      updatedUser.email = email;
      updatedUser.password = password;
    } else if (!firstname == "" && lastname == "" && email == "" && password == "") {
      updatedUser.firstName = firstname;
    } else if (firstname == "" && !lastname == "" && email == "" && password == "") {
      updatedUser.lastName = lastname;
    } else if (firstname == "" && lastname == "" && !email == "" && password == "") {
      updatedUser.email = email;
    } else if (firstname === "" && lastname === "" && email == "" && !password == "") {
      updatedUser.password = password;
    }
    userStore.updateUser(loggedInUser, updatedUser);
    response.redirect("/settings");
    logger.info("UPDATE_MEMBER_FINISHED");
  }
};

module.exports = accounts;