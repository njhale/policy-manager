// config.js
'use strict';

let mongoose = require('mongoose');
let Mockgoose = require('mockgoose').Mockgoose;
let bluebird = require('bluebird');
let events = require('events');

// create the status event emitter
let status = new events.EventEmitter();

// gather configurations
let app = process.env.APP || 'policy-manager'; // get the app name
let port = process.env.PORT || 50051;

// configure logging
let debug = require('debug');
let info = debug(`${app}:info`);
let warn = debug(`${app}:warn`);
let error = debug(`${app}:error`);

let logger = {
  info: info,
  warn: warn,
  error: error
}

// Collect related service environment variables
let mongoHost = process.env.NODE_ENV === 'test' ?
  'localhost' : 'policy-manager-db';
// let mongoHost = '172.18.0.2';
let mongoPort = process.env.MONGO_PORT || 27017;
let mongoDatabase = process.env.MONGODB_DATABASE || 'policymanagerdb';
let mongoUser = process.env.MONGODB_USER || 'nodejs';
let mongoPassword = process.env.MONGODB_PASSWORD || 'nodejs';

// let mongoUri = 
//   `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDatabase}`;
let mongoUri = 
  `mongodb://${mongoHost}:${mongoPort}/${mongoDatabase}`;

let mongoOptions = {
  autoIndex: true, // build indexes
  // sets how many times to try reconnecting
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  // bufferMaxEntries: 0
  
};

// Setup mongoose
mongoose.Promise = bluebird; // Change promise library to bluebird

let mockgoose;

// check for testing flag
if (process.env.NODE_ENV === 'test') {

  mongoUri = `mongodb://${mongoHost}:${mongoPort}/${mongoDatabase}`;

  mockgoose = new Mockgoose(mongoose);
  mockgoose.helper.setDbVersion("3.2.1");

  // wrap mongoose connection with mockgoose
  mockgoose.prepareStorage().then(() => {
    // connect
    mongoose.connect(mongoUri, mongoOptions).then(
      () => { logger.info('Mongoose connection ready'); status.emit('ready'); },
      (err) => { logger.error(`An error occured while connecting to mongodb: ${err}`); }
    );

  });

} else {
  // use real database
  mongoose.connect(mongoUri, mongoOptions).then(
    () => { logger.info('Mongoose connection ready'); status.emit('ready'); },
    (err) => { logger.error(`An error occured while connecting to mongodb: ${err}`); }
  );

}

// define a connection error event listener
mongoose.connection.on('error', (err) => {
  logger.error(`An error occured while interfacing with mongodb: ${err}`);
});



// export configurations
module.exports = {
  logger: logger,
  app: app,
  port: port,
  status: status,
  mockgoose: mockgoose
}