"use strict";
const fs = require("fs");
const path = require("path");

const FALLBACK = {
    "port": 6969,
    "name": "missing server config",
    "motd": "no server config found!",
    "maxPlayers": 0,
    "levelName": "defineLevel0"
};
const PRETTYSPACES = 4
const ENCODING = "utf-8";

/**
 * Fetches configuration files.
 * @param {string} name the name of the file.
 * @param {Server?} fallback fallback configuration. If missing, an internal one will be used.
 * @returns {Server}
 * */
function fetchConfig(name, fallback = FALLBACK) {
    const location = path.resolve(__dirname, "../configs", name);

    if (fs.existsSync(location)) {
        const config = fs.readFileSync(location, ENCODING);
        return JSON.parse(config);
    } else {
        console.warn(`Could not locate a configuration file by the name "${name}". Creating a fallback.`);

        // Create Directory (if missing)
        fs.mkdirSync(path.dirname(location), { recursive: true });

        // Create fallback configuration
        fs.writeFileSync(location, JSON.stringify(fallback, null, PRETTYSPACES));

        // Recall function
        return fetchConfig(name);
    }
}

module.exports = {fetchConfig}