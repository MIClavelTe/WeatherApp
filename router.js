var weather = require('./weather.js');
var queryString = require('querystring');
var contentType = 'html'

function userRoute(req, res) {
    var place = req.url.replace('/', "");
    if (place.length > 0) {
      res.setHeader('Content-Type', contentType);
      render.view('header', {}, res);
      render.view('style', {}, res);

      var student = new weather
      student.on('end', function(forecastJSON) {
        var values = { 
            place: forecastJSON.timezone, 
            summary: forecastJSON.currently.summary, 
            temp: forecastJSON.currently.temperature, 
            humid: forecastJSON.currently.humid
        }
        res.end();
      });

      student.on('error', function(error) { 
        res.end();
      });
  }
}

function homeRoute(req, res) {
    if (req.url == "/") {
      if(req.method.toLowerCase() === "get") {
      res.setHeader('Content-Type', contentType);
      res.end();
      }  
      else {
        req.on("data", function(postBody) {
          var query = queryString.parse(postBody.toString());
          res.writeHeader(303, {'Location': '/' + query.place});
          res.end();
        });
      }
    }
}

module.exports.user = userRoute;
module.exports.home = homeRoute;