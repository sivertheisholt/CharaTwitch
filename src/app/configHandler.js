const fs = require("fs");

const retrieveAuth = async (fileName, callback) => {
  fs.readFile(fileName, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return null;
    }
    callback(JSON.parse(data));
  });
};

const saveAuth = (fileName, authJson) => {
  // Write the updated configuration back to the JSON file
  fs.writeFile(fileName, JSON.stringify(authJson, null, 2), (writeErr) => {
    if (writeErr) {
      console.error(writeErr);
      return null;
    }

    console.log("Configuration updated.");
  });
};

module.exports = { saveAuth, retrieveAuth };
