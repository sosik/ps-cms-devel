/** @module userDao */
var mongoDriver = require('./mongoDriver');
var extend = require('extend');

var DEFAULT_USERS_COLLECTION_NAME = 'users';
var DEFAULT_OPTIONS = {
	collectionName: 'users'
};

/**
 * @constructor
 */
var UserDao = function(options) {
	var _options = extend(true, DEFAULT_OPTIONS, options || {});
	var _userCollection = mongoDriver.getDb().collection(_options.collectionName);

	/**
	 * @callback resultCallback
	 * @param {Error} err - error or null
	 * @param {Object} result - result of operation
	 */

	/**
	 * Save user object
	 *
	 * @param {Object} obj - object to save
	 * @param {resultCallback} callback - async callback
	 */
	this.save = function(obj, callback) {
		_userCollection.save(obj, function(err, result) {
			if (err) {
				callback(err);
			} 

			mongoDriver._id2id(result);
			callback(null, result);
		});
	};

	this.list = function(options, callback) {
		_userCollection.find(function(err, cursor){
			if (err) {
				callback(err);
			} else {
				cursor.toArray(function(err, data) {
					if (err) {
						callback(err);
					} else {
						callback(null, data);
					}
				});
			}
		});
	};

	/**
	 * @returns clone of actual options object 
	 */
	this.options = function() {
		return extend({}, _options);
	};
};


module.exports = {
	UserDao: UserDao
};
