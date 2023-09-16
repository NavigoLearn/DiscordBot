function getUA() {
  // get package.json
  const packagejson = require("../package.json");
  // get the version
  const version = packagejson.version;
  // get the name
  const name = packagejson.name;

  // get system info
  const os = require("os");
  const osname = os.type();
  const osversion = os.release();
  const osarch = os.arch();

  // get node info
  const nodeversion = process.version;

  // return the user agent
  return `${name}/${version} (${osname} ${osversion}; ${osarch}) Node.js/${nodeversion}`;
}

function getHeaders() {
  // set the api headers
  let headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
    "User-Agent": getUA(), // User agent
    // cache bypass
    "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
    Pragma: "no-cache",
    Age: "0",
  });
  return headers;
}

// export the functions
module.exports = {
  getUA,
  getHeaders,
};