'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const dns = require('dns');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);
// connect to database
mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true }, function(error){
  if(error) console.log(error);
  console.log("connection successful");
  console.log(mongoose.connection.readyState);
  
  //mongoose.connection.db.listCollections().toArray(function (err, names) {
  //  console.log(names);
  //  console.log(names.length);
  //});
});


// set up model
var Schema = mongoose.Schema;
var webSchema = new Schema({
  original: String,
  short: Number
});

// create model
const WebMapping = mongoose.model('webSchema', webSchema, 'WebMappingCollection');

/*
// testing kit for inserting and 
var testDocument = new WebMapping({original: 'http://x.yyyy.zzzzz', short: 13});
testDocument.save(function(err, data) {
  //console.log(data);
  if(err) {
    console.log(err);
  }
  console.log('placed');
});

WebMapping.find({original: 'i'}, function(err, data) {
  console.log('in find');
  if (data.length != 0) {
    console.log('found!' + data);
    console.log(data);
  }
  else {
    console.log('no such record');
  }
  
});
*/

app.use(cors());


/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/shorturl/:number', function(req, res) {
  console.log('in short url notation');
  console.log(req.params.number);
  var numberToFind = req.params.number;
  console.log('Mongoose connected state');
  console.log(mongoose.connection.readyState);
  
  WebMapping.find({short: numberToFind}, function(err, data) {
    console.log('in find');
    if (data.length != 0) {
      console.log('found!' + data[0]);
      console.log(data[0]);
      res.redirect(data[0].original);
    }
    else {
      console.log('no such record');
      console.log('   ');
    }

  });
  
  
})

function deleteAllDocuments() {
  WebMapping.deleteMany({}, function(err, data) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('deleted all');
    }
  });
}

app.get('/api/delete', function(req, res) {
  res.sendFile(process.cwd() + '/views/delete.html');
});

app.post('/api/delete', function(req, res) {
  console.log('here');
  deleteAllDocuments();
});

app.post('/api/shorturl/new', function(req, res) {
  
  var newURL = req.body.url;
  var newURLNoProtocal = newURL.replace(/(^\w+:|^)\/\//, '')
  console.log(newURL);
  console.log(newURLNoProtocal);
  
  //console.log('mongoose state');
  //console.log(mongoose.connection.readyState);
  
  // use the current number of documents as the integer to save
  var currentCount = 0;
  var countDocuments = WebMapping.estimatedDocumentCount(function(err, count){
    console.log('number of documents');
    console.log(count);
    currentCount = count;
  });
  WebMapping.find({}, function(err, data) {
    console.log(data);
  });
  
  // remove protocal
  dns.lookup(newURLNoProtocal, function(err, address, family) {
    if (err) {
      console.log(err);
      res.json({"error":"invalid URL"});
    }
    else {
      // try to find if the data has existed or not
      WebMapping.find({original: newURL}, function(err, data) {
        if (data.length != 0) {
          console.log('existed');
          console.log(data);
          res.json({original_url: data[0].original.replace(/(^\w+:|^)\/\//, ''), short_url: data[0].short})
        }
        else {
          console.log('not existed in the dataset');
          var newRecord = {original: newURL, short: currentCount + 1};
          var newRecord2Save = new WebMapping(newRecord);
          res.json({original_url: newRecord.original.replace(/(^\w+:|^)\/\//, ''), short_url: newRecord.short})
          newRecord2Save.save(function(err, data) {
            //console.log(data);
            if(err) {
              console.log(err);
            }
            console.log('record saved.');
          });
        }
      });
      
    }
  })
  
  
  
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});