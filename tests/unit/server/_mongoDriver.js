var expect = require('chai').expect;
var realMongoClient = require('mongodb').MongoClient;
var realObjectID = require('mongodb').ObjectID;

describe('_mongoDriver', function() {
	it('should unmangle mongo ObjectID into string representation', function() {
		var _mongoDriver = require(process.cwd() + '/build/server/_mongoDriver.js')(realMongoClient, realObjectID);
		var _id = new realObjectID();
		var obj = {
			_id: _id,
			name: 'fero',
			age: '15'
		};

		var mangledObj = _mongoDriver._id2id(obj);
		expect(mangledObj).to.be.equal(obj);
		expect(mangledObj).to.include.key('id');
		expect(mangledObj).to.not.include.key('_id');
		expect(mangledObj.id).to.equal(_id.toHexString());
	});
	it('should mangling text representation of id into mongo ObjectID', function() {
		var _mongoDriver = require(process.cwd() + '/build/server/_mongoDriver.js')(realMongoClient, realObjectID);
		var id = '533fddbabdb11f0215c03316';
		var obj = {
			id: id,
			name: 'fero',
			age: '15'
		};

		var mangledObj = _mongoDriver.id2_id(obj);
		expect(mangledObj).to.be.equal(obj);
		expect(mangledObj).to.include.key('_id');
		expect(mangledObj).to.not.include.key('id');
		expect(mangledObj._id).to.be.an.instanceof(realObjectID);
	});
});
