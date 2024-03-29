var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  var statusCode = callback;
  console.log(asset);
  res.writeHead(statusCode, headers);
  fs.readFile(asset, function (err, data) {
    if (err) {
      throw err;
    }
    res.end(data);
  });
};

exports.redirectToLoading = function(res) {
  res.writeHead(302, {location: '/public/loading.html'});
  res.end();
};

exports.fileNotFound = function(res) {
  res.writeHead(404, headers);
  res.end();
};

// As you progress, keep thinking about what helper functions you can put here!
