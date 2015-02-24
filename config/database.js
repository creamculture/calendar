(function (database) {

    var mongodb = require("mongodb");
    var config = require('../../config/config');
    var theDb = null;

    database.getDb = function(next){
        if(!theDb) {
            //connect to the database
            mongodb.MongoClient.connect(config.db, function (err, db) {
                if(err){
                    next(null);
                } else {
                    theDb = {
                        db: db,
                        questionnaires: db.collection("questionnaires")
                    };
                    next(theDb);
                }
            });
        } else {
            next(theDb);
        }
    }

})(module.exports)
