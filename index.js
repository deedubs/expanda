var http = require('http')
  , parseUrl = require('url').parse
  , Expanda = {};
  
expandUrl = function(url, options, callback) {
  if(!options)
    var options = {orignialUrl: url};
    
  var parsedUrl = parseUrl(url);
  var request = http.request({
    host: parsedUrl.hostname
  , port: parsedUrl.port || 80
  , path: parsedUrl.pathname + (parsedUrl.search || '')
  , method: 'HEAD'
  }, function(response) {
    if(!response.headers.location) {
      callback(null,{old: options.orignialUrl, new: options.lastUrl || options.orignialUrl})
    } else {
      options.lastUrl = response.headers.location;
      expandUrl(response.headers.location, options, callback);
    }
  });
  request.on('error',callback)
  request.end();
}

module.exports = function(inputString, pattern, callback) {
  var expandedCount = 0
    , urls = []
    , expandaUrls = [];

  if (!(pattern instanceof RegExp))
    callback = pattern, pattern = /https?:\/\/(bit.ly|ow.ly|is.gd|t.co)\/\S+/g;
  
  var locatedUrls = inputString.match(pattern);
  if(!locatedUrls) {
    callback(null, inputString, []);
    return;
  };
  
  locatedUrls.forEach(function(url) {
    expandUrl(url, false, function(err, expanded) {
      expandaUrls.push(expanded);
      urls.push(expanded.new);        
      if(++expandedCount == locatedUrls.length) {
        var outputString = inputString;       
        expandaUrls.forEach(function(replacement){
          outputString = outputString.replace(replacement.old, replacement.new);
        });
        callback(null, outputString, urls);
      } 
    })
  })
}