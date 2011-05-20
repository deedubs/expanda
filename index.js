var http = require('http')
  , parseUrl = require('url').parse
  , Expanda = {};
  
Expanda.pattern = /https?:\/\/(bit.ly|ow.ly|is.gd|t.co)\/\S+/g;
  
Expanda.expandUrl = function(url, options, callback) {
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
      callback(null,{old: options.orignialUrl, new: options.lastUrl})
    } else {
      options.lastUrl = response.headers.location;
      Expanda.expandUrl(response.headers.location, options, callback);
    }
  });
  request.on('error',callback)
  request.end();
}

Expanda.process = function(inputString, callback) {
  var expandedCount = 0
    , urls = []
    , expandadUrls = []
    , locatedUrls = inputString.match(Expanda.pattern);
  if(!locatedUrls) {
    callback(null, inputString, []);
    return;
  };
  
  locatedUrls.forEach(function(url) {
    Expanda.expandUrl(url, false, function(err, expanded) {
      expandadUrls.push(expanded);
      urls.push(expanded.new);        
      if(++expandedCount == locatedUrls.length) {
        var outputString = inputString;       
        expandadUrls.forEach(function(replacement){
          outputString = outputString.replace(replacement.old, replacement.new);
        });
        callback(null, outputString, urls);
      } 
    })
  })
}

module.exports = Expanda;