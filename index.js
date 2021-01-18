"use strict";

const dbServiceMixin = require("./src/dbServiceMixin");

const { CloudFirestoreAdapter } = require("./src/adapters");

module.exports = { dbServiceMixin, CloudFirestoreAdapter };
