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
		mongoDriver.id2_id(obj);
		_userCollection.save(obj, function(err, result) {
			if (err) {
				callback(err);
				return;
			} 

			mongoDriver._id2id(result);
			callback(null, result);
		});
	};

	this.get = function(id, callback) {
		_userCollection.findOne(mongoDriver.id2_id({"id":id}), function(err, data) {
			if (err) {
				callback(err);
				return;
			}

			callback(null, mongoDriver._id2id(data));
		});
	};

	this.update = function(obj, callback) {
		if (!obj.id) {
			callback(new Error('Updated object has to have id'));
			return;
		}
		var searchKey = mongoDriver.id2_id({'id': obj.id});
		var updateObj = extend({}, obj);
		delete updateObj.id;

		if (!searchKey._id) {
			callback(new Error('Failed to construct object identifier'));
			return;
		}
		_userCollection.update(searchKey,
				mongoDriver.constructUpdateObject(obj),
				{upsert: false, multi: false}, function(err, count, result) {
			if (err) {
				callback(err);
				return;
			}
			
			if (!result.updatedExisting || result.n !== 1) {
				callback(new Error('Neither object with id ' + obj.id + ' not found or updated more documents'));
				return;
			}
			callback(null, count);
		});
	};

	this.remove = function(id, callback) {
		_userCollection.remove(mongoDriver.id2_id({"id":id}), function(err, count){
			if (err) {
				callback(err);
				return;
			}

			if (count !== 1) {
				callback(new Error('Removed '+ count + ' documents'));
				return;
			}

			callback(null, count);
		});
	};

	this.list = function(options, callback) {
		_userCollection.find(function(err, cursor){
			if (err) {
				callback(err);
				return;
			}

			cursor.toArray(function(err, data) {
				if (err) {
					callback(err);
					return;
				}

				callback(null, data);
				return;
			});
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
