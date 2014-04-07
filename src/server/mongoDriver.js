var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

module.exports = require('./_mongoDriver')(MongoClient, ObjectID);
