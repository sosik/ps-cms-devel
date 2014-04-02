var mongoDriver = require('./mongoDriver');
var extend = require('extend');

var DEFAULT_USERS_COLLECTION_NAME = 'users';
var DEFAULT_OPTIONS = {
	collectionName: 'users'
};

var UserDao = function(options) {
	var _options = extend(true, DEFAULT_OPTIONS, options || {});
	var _userCollection = mongoDriver.getDb().collection(_options.collectionName || DEFAULT_USERS_COLLECTION_NAME);

	this.saveUser = function(obj, callback) {
		_userCollection.save(obj, function(err, result) {
			if (err) {
				callback(err);
			}

			callback(null, result);
		});
	};
}


module.exports = {
		UserDao: UserDao;
	}
}
