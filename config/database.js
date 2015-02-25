(function (database) {

    var mongodb = require("mongodb");
    var theDb = null;

    database.getDb = function(next){
        if(!theDb) {
            //connect to the database
            mongodb.MongoClient.connect('mongodb://admin:admin@ds053838.mongolab.com:53838/heroku_app33580717', function (err, db) {
                if(err){
                    next(null);
                } else {
                    theDb = {
                        db: db
                    };
                    next(theDb);
                }
            });
        } else {
            next(theDb);
        }
    }

})(module.exports)
