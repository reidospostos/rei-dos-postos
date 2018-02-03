require('dotenv').config({path: '../iotnetwork-config/.env'})
var request = require('request');

var googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_NODEJS_API_KEY
});

var MongoClient = require('mongodb').MongoClient;

//I suspect that authentication is failing because of SSL..
// Whitelisting every ip to see if it works
/*
var mongoDBAtlasURI = "mongodb://admin:" + process.env.MONGODB_ATLAS_PASSWORD +
                      "@iotnetwork-shard-00-00-3opqn.mongodb.net:" +
                      "27017,iotnetwork-shard-00-01-3opqn.mongodb.net:" +
                      "27017,iotnetwork-shard-00-02-3opqn.mongodb.net:" +
                      "27017/test?" +
                      "ssl=true&replicaSet=iotnetwork-shard-0&authSource=admin";

MongoClient.connect(mongoDBAtlasURI, function(err, db) {
  if (err) throw err;
  var stationDB = db.db("stationDB");
  db.close();
});
*/

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('assets'))


app.get('/', function(req, res) {
  res.render('index', { gMapsApiKey: process.env.GOOGLE_MAPS_JS_API_KEY })
})

io.on('connection', function(socket) {

  //console.log('a user connected');

  //socket.on('disconnect', function() {
  //  console.log('user disconnected');
  //});

  socket.on('address', function(url) {

    console.log(msg.address);
    googleMapsClient.geocode({
      address: msg.address,
      bounds: {
        // box bounds - params are different from web API
        south: -16.746071,
        west: -49.378115,
        north: -16.577367,
        east: -49.180833
      }
    }, function(err, response) {
      if (!err) {
        var location = response.json.results[0].geometry.location;
        var place_id = response.json.results[0].place_id;
        console.log(location);
        console.log(place_id);
        var result = {
          msg: msg.address,
          location: location,
          place_id: place_id
        }
        io.emit('create marker', result);
        console.log("Resultado total: ");
        console.log(response.json.results);
      }
    });
  });
});

http.listen(3000, function() {
  console.log('Example app listening on port 3000!')
})
