"use strict";

const dbServiceMixin = require("./src/dbServiceMixin");

const { FirestoreAdapter } = require("./src/adapters");

module.exports = { dbServiceMixin, FirestoreAdapter };
