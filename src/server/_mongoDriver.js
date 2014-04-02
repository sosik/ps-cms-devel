module.exports = function(MongoClient) {
	var database;

	return {
		/* async db initialization */
		init: function(mongoDbURI, callback) {
			MongoClient.connect(mongoDbURI, function(err, db) {
				if (err) {
					callback(err);
				}

				database = db;
				callback(null);
			});
		},
			getDb: function() {
		}
	};
};
