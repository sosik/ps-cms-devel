var MongoClient = require('mongodb').MongoClient;
module.exports = require('./_mongoDriver')(MongoClient);
