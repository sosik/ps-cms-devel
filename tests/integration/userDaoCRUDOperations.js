var expect = require('chai').expect;
var config = require(process.cwd() + '/build/server/config.js');
var mongoDriver = require(process.cwd() + '/build/server/mongoDriver.js');
var ObjectID = require('mongodb').ObjectID;
var UserDao = require(process.cwd() + '/build/server/userDao.js').UserDao;

var user1 = {
		name: {
			firstName: "John",
			lastName: "Doe"
		},
		address: {
			street: "First Lane",
			houseNo: 25,
			city: "New York",
			zipCode: "12366"
		}
	};


describe('userCRUDOperations', function() {
	var userDao;
	var savedId;

	before(function(done) {
		mongoDriver.init(config.mongoDbURI_test, function(err) {
			if (err) {
				console.error('Failed to init database:' + config.mongoDbURI_test);
				throw new Error('Failed to init database');
			}

			userDao = new UserDao();
			var usersCollection = userDao.options().collectionName;
			mongoDriver.getDb().createCollection(usersCollection, function(err, callback){
				if (err) {
					throw new Error(err);
				}
				done();
			});
		});
	});
	after(function (done){
		mongoDriver.getDb().dropDatabase(function(err) {
			if (err) {
				console.error('Failed to drop database:' + config.mongoDbURI_test);
				throw new Error('Failed to remove database');
			}

			done();
		});
	});
	it('Create - dao should create user', function(done) {
		// this is first test, there should be no user
		var usersCollection = userDao.options().collectionName;

		userDao.save(user1, function(err, data) {
			if (err) {
				throw new Error(err);
			}

			mongoDriver.getDb().collection(usersCollection).find(function(err, cursor) {
				if (err) {
					throw new Error(err);
				}

				cursor.toArray(function(err, mongoData) {
					if (err) {
						throw new Error(err);
					}
					// we inserted single record into empty collection
					expect(mongoData.length).to.be.equal(1);
					expect(mongoData[0].name.firstName).to.be.equal(user1.name.firstName);
					expect(mongoData[0]._id).to.not.be.undefined;
					expect(mongoData[0]._id.toHexString()).to.be.equal(data.id);

					savedId = user1.id;
					done();
				});
			});
		});
	});
	it('Read - dao should return saved user', function(done) {
		var usersCollection = userDao.options().collectionName;

		userDao.get(user1.id, function(err, data) {
			if (err) {
				throw new Error(err);
			}

			mongoDriver.getDb().collection(usersCollection).findOne({"_id": new ObjectID.createFromHexString(user1.id)}, function(err, mongoData) {
				if (err) {
					throw new Error(err);
				}

				expect(mongoData._id.toHexString()).to.be.equal(data.id);
				expect(data.id).to.be.equal(user1.id);
				expect(data).to.be.eql(user1);

				done();
			});
		});
	});
	it('Update - dao should update saved object', function(done) {
		var usersCollection = userDao.options().collectionName;	
		var updatedUser = {
			id: user1.id,
			name: {
				firstName: 'Jim'
			},
			address: {
				city: null
			}
		};

		userDao.update(updatedUser, function(err, count){
			if (err) {
				throw new Error(err);
			}
			
			expect(count).to.be.equal(1);
			
			mongoDriver.getDb().collection(usersCollection).findOne({"_id": new ObjectID.createFromHexString(user1.id)}, function(err, mongoData) {
				if (err) {
					throw new Error(err);
				}
				expect(mongoData._id.toHexString()).to.be.equal(updatedUser.id);
				expect(mongoData.name.firstName).to.be.equal(updatedUser.name.firstName);
				expect(mongoData.name.lastName).to.be.equal(user1.name.lastName);
				expect(mongoData.address).to.not.include.key('city');

				done();
			});
		});
	});
	it('Delete - dao should remove saved object', function(done) {
		userDao.remove(user1.id, function(err, count) {
			if (err) {
				throw new Error(err);
			}

			expect(count).to.be.equal(1);
			done();
		});
	});
});
