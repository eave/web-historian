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
    httpHelpers.serveAssets(res, (archive.paths.siteAssets + routes[req.url]), 200);
  }
  else {
    console.log("I should be real!");
    archive.isURLArchived(req.url, function(result) {
      if (result) {
        httpHelpers.serveAssets(res, (archive.paths.archivedSites + req.url), 200);
      } else {
        archive.isUrlInList(req.url, function(test) {
          if (test) {
            httpHelpers.serveAssets(res, (archive.paths.archivedSites + req.url), 200);
          } else {
            httpHelpers.fileNotFound(res);
          }
        });
      }
    });
  }
};

var postData = function(req, res) {
  var testUrl = req._postData.url;
  archive.isURLArchived(testUrl, function(result) {
    if (result) {
      httpHelpers.serveAssets(res, (archive.paths.archivedSites + testUrl), 200);
    } else {
      archive.isUrlInList(testUrl, function(test) {
        if (test) {
          httpHelpers.redirectToLoading(res);
        } else {
          archive.addUrlToList(testUrl, function() {
            httpHelpers.redirectToLoading(res);
          });
        }
      });
      // var test = archive.isUrlInList(testUrl);
      // if (test) {
      //   httpHelpers.redirectToLoading(res);
      // } else {
      //   console.log("meow" + testUrl);
      //   archive.addUrlToList(testUrl, function() {
      //     httpHelpers.redirectToLoading(res);
      //   });
      // }
    }
  });
};

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
