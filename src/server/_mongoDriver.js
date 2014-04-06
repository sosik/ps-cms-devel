module.exports = function(MongoClient, ObjectID) {
	var _database = null;

	return {
		/* async db initialization */
		init: function(mongoDbURI, callback) {
			MongoClient.connect(mongoDbURI, function(err, db) {
				if (err) {
					callback(err);
				}

				_database = db;
				callback(null);
			});
		},
		getDb: function() {
			//TODO add logging
			if (!_database) {
				throw new Error('Database instance is not initialized!');
			}

			return _database;
		},
		close: function() {
			_database.close();
		},
		/**
		 * Function converts ObjectId form mongo returned object into flat
		 * hexadecimal representation of id
		 *
		 * @param obj to mangle
		 * @return mangled object
		 */
		_id2id: function(obj) {
			if (obj && obj._id) {
				var mangledId = obj._id.toHexString();
				obj.id = mangledId;
				delete obj._id;
				return obj;
			}
			// nothing to mangle
			return obj;
		},
		id2_id: function(obj) {
			if (obj && obj.id) {
				var idToMangle = obj.id;
				obj._id = ObjectID.createFromHexString(idToMangle);
				delete obj.id;
				return obj;
			}
			// nothing to mangle
			return obj;
		}
	};
};
