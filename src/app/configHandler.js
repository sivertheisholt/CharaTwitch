const fs = require("fs");

const retrieveAuth = async (fileName, callback) => {
  fs.readFile(fileName, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      let temp = {
        cai_access_token: "",
        cai_character_id: "",
        cai_use_plus: false,
        twitch_client_secret: "",
        twitch_client_id: "",
        twitch_username: "",
        twitch_trigger_word: "",
        twich_listen_to_trigger: false,
      };
      return callback(temp);
    } else {
      callback(JSON.parse(data));
    }
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
