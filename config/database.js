(function (database) {

    var mongodb = require("mongodb");
    var theDb = null;

    database.getDb = function(next){
        if(!theDb) {
            //connect to the database
            mongodb.MongoClient.connect('mongodb://localhost/CreamCulture', function (err, db) {
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