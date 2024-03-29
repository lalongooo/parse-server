// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://lalongooo:Mand191205-@ds133428.mlab.com:33428/heroku_3lj2tr02',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'YgTCdpVe34aU64CK9KzZwbNxC',
  masterKey: process.env.MASTER_KEY || 'R19xTlTYa7Ag2fm41Usj4eavr', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'https://permutas-sep-parse-dev-github.herokuapp.com/parse',  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  },
  push: {
    android: {
      senderId: '61932668028', // The Sender ID of GCM
      apiKey: 'AAAADmt5hHw:APA91bHewkeMM8QLW_ljmDQGeaGc_nvubzozZGYMnIExeddBjuXWN5SZs6SFfBb1SUIxzRmMKsDow6U8nrzQXc53kyOeOX7I_P88ozjSO5BODPg8iR-TIbEZXHlZvxTTemj0-heBh3rDcmDEYWb44Zpw5gmTi-VDrg' // The Server API Key of GCM
    }
  }


});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
