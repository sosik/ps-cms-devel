var extend = require('extend');
var mongoDriver = require('./mongoDriver');

var DEFAULT_OPTIONS = {
};

/**
 * @class
 * Configurable universal dao used to access data in mongoDB
 */
var UniversalDao = function(mongoDriver, options) {
	if (!mongoDriver) {
		throw new Error('Paramenter mongoDriver is not provided!');
	}
	var _options = extend(true, {}, DEFAULT_OPTIONS, options || {});

	if (!_options.collectionName) {
		throw new Error('Parameter options.collectionName is mandatory!');
	}
	
	var _collection = mongoDriver.getDb().collection(_options.collectionName);


	/**
	 * @callback resultCallback
	 * @param {Error} err - error or null
	 * @param {Object} result - result of operation
	 */

	/**
	 * Save object
	 *
	 * @param {Object} obj - object to save
	 * @param {resultCallback} callback - async callback
	 */
	this.save = function(obj, callback) {
		mongoDriver.id2_id(obj);
		_collection.save(obj, function(err, result) {
			if (err) {
				callback(err);
				return;
			} 

			mongoDriver._id2id(result);
			callback(null, result);
		});
	};


	/**
	 * Get object
	 *
	 * @param {String} id - object identifier as string
	 * @param {resultCallback} callback - async callback
	 */
	this.get = function(id, callback) {
		_collection.findOne(mongoDriver.id2_id({"id":id}), function(err, data) {
			if (err) {
				callback(err);
				return;
			}

			callback(null, mongoDriver._id2id(data));
		});
	};

	/**
	 * Update object
	 *
	 * @param {Object} obj - object to update, it has to contain id field as string
	 * @param {resultCallback} callback - async callback, result parameter contains number of upadet objects
	 */
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
		_collection.update(searchKey,
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

	/**
	 * Remove object
	 *
	 * @param {String} id - object identifier as string
	 * @param {resultCallback} callback - async callback, result parameter contains number of removed objects
	 */
	this.remove = function(id, callback) {
		_collection.remove(mongoDriver.id2_id({"id":id}), function(err, count){
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

	/**
	 * List objects by criteria
	 *
	 * @param {Object} options - search options
	 * @param {resultCallback} callback - async callback, result parameter contains found objects
	 */
	this.list = function(options, callback) {
		var _findOptions = mongoDriver.constructSearchQuery(options);

		_collection.find(_findOptions.selector, _findOptions, function(err, cursor){
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
	 * Get actual dao options
	 *
	 * @returns clone of actual options object 
	 */
	this.options = function() {
		return extend({}, _options);
	};
};

module.exports = {
	UniversalDao: UniversalDao
};
