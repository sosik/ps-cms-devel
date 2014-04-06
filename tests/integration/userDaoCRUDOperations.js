var expect = require('chai').expect;
var config = require(process.cwd() + '/build/server/config.js');
var mongoDriver = require(process.cwd() + '/build/server/mongoDriver.js');
var UserDao = require(process.cwd() + '/build/server/userDao.js').UserDao;

describe('userCRUDOperations', function() {
	var userDao;

	before(function(done) {
		mongoDriver.init(config.mongoDbURI_test, function(err) {
			if (err) {
				console.error('Failed to init database:' + config.mongoDbURI_test);
				throw new Error('Failed to init database');
			}

			userDao = new UserDao();
			done();
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
		var obj = {
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

		userDao.save(obj, function(err, data) {
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
					expect(mongoData[0].name.firstName).to.be.equal(obj.name.firstName);
					expect(mongoData[0]._id).to.not.be.undefined;
					expect(mongoData[0]._id.toHexString()).to.be.equal(data.id);

					done();
				});
			});
		});
	});
});
