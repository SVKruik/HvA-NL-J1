import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.live.js";

// Get ISO country code
const pop = window.location.href.split(`${window.location.hostname}/kaart-redirect.html?`).pop();

// Upload it into the session so that it can be used in zoek.html
await FYSCloud.Session.set("kaartTarget", pop);

// After session data is uploaded, go to zoek.html
window.location.href = "zoek.html";
