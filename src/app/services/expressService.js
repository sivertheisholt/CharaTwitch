const express = require("express");
const app = express();
app.use(express.json());

class ExpressService {
  constructor() {
    this.app = app;
    app.listen(3000, () =>
      console.log("Application is now listening on port: 3000")
    );
  }
}

/** @type {ExpressService | null} */
let instance = null;

/**
 * @returns {ExpressService}
 */
function getSharedService() {
  if (!instance) {
    instance = new ExpressService();
  }
  return instance;
}

module.exports = getSharedService;
