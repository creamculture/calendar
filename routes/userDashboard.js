//Server-side
var fs      = require('fs');
var mongo   = require('mongodb');
var Grid    = require('gridfs-stream');
var myDb = require('../config/database');

exports.renderUserDashboard = function(req, res) {
    if( req.session.username )
        res.render('user_dashboard', {"username": req.session.username});
    else
        res.send("FORBIDDEN!");
};

//Update user doc in DB with this newly created event
function updateUserInfo(req, idStr){
    var userCollection = req.db.get("users");
    userCollection.update(
       { username: req.session.username },
       { $push: { eventsCreated: idStr } }
    );
}

// Deserializes and saves in DB the form sent from client
exports.saveNewEvent = function(req, res) {
	var name = req.body.eventName;
	var address = req.body.eventAddr;
	var city = req.body.eventCity;
	var startDate = req.body.startDate;
    var endDate = req.body.endDate;
	var description = req.body.eventDesc;

    var eventsCollection = req.db.get("events");

    eventsCollection.insert({
    	"name" : name,
    	"address" : address,
    	"city" : city,
    	"startDate" : startDate,
        "endDate" : endDate,
    	"description" : description,
        "attendees" : [ req.session.username ]
    	}, function (err, doc) {
			if (err) 
				res.send("There was a problem adding an event to the database.");
			else{
                updateUserInfo(req, doc._id);
				res.send("Event successfully added to DB");
            }
    	}
    );


};

//Called by calendar to populate with events
exports.getEvents = function(req, res){

    var eventsCollection = req.db.get("events");

    eventsCollection.find( {}, function(err, doc){
        res.send( doc );
    });

};

exports.uploadProfilePicture = function(req, res){
  //console.log(JSON.stringify(req.files));
  var serverPath = 'images/profile/' + req.files.userPhoto.name;
  var pathToServer = './public/';

  fs.rename(
    //userPhoto is the input name
    req.files.userPhoto.path,
    pathToServer + serverPath,
    function(error){
      if(error){
        console.log(error)
        res.send({
          error: 'File uploaded cancelled, error.'
        });
        return;
      }

      res.send({
        path: serverPath
      });
    }
  )

};

exports.cropProfilePicture = function(req, res){
  var gm = require('gm').subClass({ imageMagick: true });
  var resizeX = 400;
  var resizeY = 400;

  var src = req.body.src;
  var name = req.body.name;
  var coords = req.body.data;
  var pathToServer = './public/';
  var pathToFile = pathToServer + 'images/profile/' + req.session.username;

  gm(pathToServer + src).crop(coords.w, coords.h, coords.x, coords.y).resize(resizeX,resizeY).write(pathToFile, function(err){
    if (!err){
      console.log("Image: " + name + " Cropped");

      myDb.getDb(function (ret) {
        var gfs = Grid(ret.db, mongo);

        gfs.remove({ filename: req.session.username }, function (err) {

          if (err) return res.send(err);
          var writestream = gfs.createWriteStream({ filename: req.session.username });
          // open a stream to the temporary file created by Express...
          fs.createReadStream(pathToFile)
            .pipe(writestream);

          // Clean up
          fs.unlink(pathToServer + src, function (err) {
            if (err) return res.send(err);

            fs.unlink(pathToFile, function (err) {
              if (err) return res.send(err);
              res.send("success");
            });
          });
        });
      })
    }
    else
    {
      res.send(err);
    }
  });
};

exports.getProfilePicture = function(req, res) {
  myDb.getDb(function (ret) {
    var gfs = Grid(ret.db, mongo);
    gfs.exist({filename: req.session.username}, function (err, found) {
      if (err) return res.send(err);

      if(found){
        gfs.createReadStream({filename: req.session.username})
          // and pipe it to Express' response
          .pipe(res);
      } else {
        var readStream = fs.createReadStream('./public/images/userface.jpg');
        // We replaced all the event handlers with a simple call to readStream.pipe()
        readStream.pipe(res);
      }
    });
  });
};