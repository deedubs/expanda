var http = require('http')
  , parseUrl = require('url').parse
  , Step = require('step');
  
pattern = /https?:\/\/(bit.ly|ow.ly|is.gd|t.co)\/\S+/g

expandUrl = function(url, options, callback) {
  if(!options)
    options = {orignialUrl: url};
    
  var parsedUrl = parseUrl(url);
  var request = http.request({
    host: parsedUrl.hostname
  , port: parsedUrl.port || 80
  , path: parsedUrl.pathname + (parsedUrl.search || '')
  , method: 'HEAD'
  }, function(response) {
    if(!response.headers.location) {
      callback(null,{old: options.orignialUrl, new: options.lastUrl})
    } else {
      options.lastUrl = response.headers.location;
      expandUrl(response.headers.location, options, callback);
    }
  });
  request.end();
}

module.exports = {
  process: function(inputString, callback) {
    var locatedUrls = inputString.match(pattern);
    
    Step(
        function parseUrls() {
          var group = this.group();
          if(locatedUrls) {
            locatedUrls.forEach(function(url){
              expandUrl(url, false, group());
            });
          }
        },
        function(err, expandedUrls) {
          outputString = inputString;
          expandedUrls.forEach(function(replacement){
            outputString = outputString.replace(replacement.old, replacement.new);
          });
          callback(null, outputString);
        }
      );
  }
}