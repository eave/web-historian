var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!


var routes = {
  "/": "/index.html",
};

var getData = function(req, res) {
  if (routes[req.url]) {
    console.log("Success");
    httpHelpers.serveAssets(res, (archive.paths.siteAssets + routes[req.url]), 200);
  }
  else {
    archive.isURLArchived(req.url, function(result) {
      if (result) {
        console.log((archive.paths.archivedSites + req.url));
        httpHelpers.serveAssets(res, (archive.paths.archivedSites + req.url), 200);
      }
    });
  }
};

var postData = function(req, res) {};

var actions = {
  "GET": getData,
  "POST": postData,
};


exports.handleRequest = function (req, res) {
  console.log(req.method);
  var action = actions[req.method];
  console.log(action);
  if (action) {
    action(req, res);
  }
};
