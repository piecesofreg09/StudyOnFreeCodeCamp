const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose');
//mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )
function mongooseConnect() {
  mongoose.connect(process.env.MURI, { useNewUrlParser: true, useUnifiedTopology: true }, function(error){
    if(error) console.log(error);
    console.log("connection successful");
    //console.log(mongoose.connection.readyState);

    mongoose.connection.db.listCollections().toArray(function (err, names) {
      //console.log(names.map((x, ind) => x.name));
      console.log(names.length);
    });
  });
}

mongooseConnect();

// define schema
var Schema = mongoose.Schema;
var RecordSchema = new Schema({
  description: String,
  duration: Number,
  date: Date
});
var UserSchema = new Schema({
  username: String,
  records: [RecordSchema]
});

const User = mongoose.model('User', UserSchema, 'users');
const Record = mongoose.model('Record', RecordSchema, 'records');

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

/*
// Not found middleware
app.use((req, res, next) => {
  console.log(req);
  return next({status: 404, message: 'not found'})
})


// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})
*/

// create new user
app.post("/api/exercise/new-user", function(req, res) {
  var username = req.body.username;
  console.log(req.body.username);
  
  User.findOne({username: username}, (err, data) => {
    if (err) {
      console.log('error' + err);
    }
    else {
      if (data) {
        res.json('Existed user with name: ' + username);
      }
      else {
        // create new user and save
        var newUser = new User({username: username});
        console.log(newUser);
        
        newUser.save((err, data) => {
          if (err) console.log(err);
          else {
            console.log('data saved');
            console.log(data);
            res.json({_id: data._id, username: data.username});
          }
        });
      }
      
    }
  });
  
  
});
// delete everything
app.get("/api/delete", (req, res) => {
  User.deleteMany({}, (err, data) => {
    console.log(data);
    console.log('deleted');
    res.json('deleted');
  })
});

// get user information
app.get("/api/exercise/users", (req, res) => {
  console.log('in get user info:');
  User.find({}, (err, data) => {
    console.log(data);
    res.json(data.map((x, idd) => x.username));
  })
});

// add new exercise
app.post("/api/exercise/add", function(req, res) {
  var reqBody = req.body;
  
  // create new record
  var newRecord = new Record({
    description: reqBody.description,
    duration: reqBody.duration,
    date: reqBody.date ? reqBody.date : new Date()
  });
  
  var userId = reqBody.userId;
  
  User.findById(userId, (err, data) => {
    if (err) {
      console.log('error' + err);
    }
    else {
      if (data) {
        data.records.push(newRecord);
        data.save((err, dataEx) => {
          if (err) console.log(err);
          else {
            console.log('new exercise added');
            console.log(dataEx);
            res.json('new exercise added:\n');
          }
        });
      }
      else {
        console.log('cannot find this user' + err);
        res.json('Cannot find this user with id: ' + userId)
      }
      
    }
  });
  
});

// get log
app.get("/api/exercise/log", function(req, res) {
  var reqQuery = req.query;
  console.log(reqQuery);
  if (!reqQuery.hasOwnProperty('userId')) {
    res.json({'error': 'no user id provided'});
  }
  else {
    var userId = reqQuery.userId;
    
    User.findById(userId, (err, data) => {
      if (err) {
        console.log('err' + err);
        res.json('An error occured, please check userId format.');
      }
      else {
        if (data) {
          //console.log(data.records);
          var allDates = data.records.map((v, idd) => v.date);
          var maxDate = Math.max.apply(null, allDates);
          var minDate = Math.min.apply(null, allDates);
          var maxDur = Math.min.apply(null, 
                                      data.records.map((v, idd) => v.duration));
          
          var from = new Date(reqQuery.from ? reqQuery.from : minDate);
          var to = new Date(reqQuery.from ? reqQuery.from : maxDate);
          var limit = reqQuery.limit ? reqQuery.limit : allDates.length;
          
          console.log('from: '+ from + ' to: ' + to + ' limit: ' + limit);
          //console.log(data);
          
          var filteredRecords = data.records.filter((x, v) => (
          x.date >= from && x.date <=to && x.duration <= limit));
          
          //console.log(data.records[0].date >= from);
          
          data.records = filteredRecords;
          
          res.json({data: data, count: filteredRecords.length});
        }
        else {
          console.log('Not found user with id: ' + userId);
          res.json('Not found user with id: ' + userId);
        }
        
      }
    })
    
  }
  
  
});

app.get("/api/haha", function(req, res) {
  res.json({1:2});
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
