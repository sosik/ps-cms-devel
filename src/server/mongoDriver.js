var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

module.exports = require('./_mongoDriver')(MongoClient, ObjectId);
