var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http-request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  var dataArray = false;
  fs.readFile(exports.paths.list, function (err, data) {
    if (err) {
      throw err; // may need to change this to handle errors
    }
    var dataArray = data.toString().split("\n");
    callback(dataArray);
  });
};

exports.isUrlInList = function(url, callback){
  exports.readListOfUrls(function(dataArray) {
    for (var i = 0; i < dataArray.length; i++) {
      if (url === dataArray[i]) {
        return callback(true);
      }
    }
    callback(false);
  });
};

exports.addUrlToList = function(url, callback){
  fs.appendFile(exports.paths.list, (url + "\n"), function(err) {
    if (err) {
      throw err;
    }
    callback();
  });
};

exports.isURLArchived = function(url, callback){
  if (url[0] === "/") {url = url.slice(1);};
  fs.readdir(exports.paths.archivedSites, function(err, files){
    if (err) {
      throw err;
    } else {
      var flag = false;
      _.each(files, function(file) {
        if (file === url) {
          flag = true;
        }
      });
      callback(flag);
    }
  });
};

exports.downloadUrls = function(){
  exports.readListOfUrls(function(dataArray) {
    _.each(dataArray, function(element) {
      exports.isURLArchived(element, function(test) {
        if (!test) {
          http.get({
            url: element,
            progress: function(current, total) {
              console.log("Loading...");
            }
          }, (exports.paths.archivedSites +"/"+ element), function(err, res) {
            if (err) {
              console.error(err);
              return;
            }
          });
        }
      });
    });
  });
};
