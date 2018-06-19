// config.js

let mongoose = require('mongoose');
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
let mongoPort = process.env.MONGO_PORT || 27017;
let mongoDatabase = process.env.MONGODB_DATABASE || 'policymanagerdb';
let mongoUser = process.env.MONGODB_USER || 'nodejs';
let mongoPassword = process.env.MONGODB_PASSWORD || 'nodejs';

let mongoUri = 
  `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDatabase}`;

let mongoOptions = {
  autoIndex: true, // build indexes
  // sets how many times to try reconnecting
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
  
};

// Setup mongoose
mongoose.Promise = bluebird; // Change promise library to bluebird

// check for testing flag
if (process.env.NODE_ENV === 'test') {
  // use mock database for testing
  const Mockgoose = require('mockgoose').Mockgoose;
  const mockgoose = new Mockgoose(mongoose);

  // wrap mongoose connection with mockgoose
  mockgoose.prepareStorage().then(() => {
    mongoose.connect(mongoUri, mongoOptions).then(
      () => { logger.info('Mongoose connection ready'); },
      (err) => { logger.error(`An error occured while connecting to mongodb: ${err}`); }
    );
  });

} else {
  // use real database
  mongoose.connect(mongoUri, mongoOptions).then(
    () => { logger.info('Mongoose connection ready'); },
    (err) => { logger.error(`An error occured while connecting to mongodb: ${err}`); }
  );

}

// define a connection error event listener
mongoose.connection.on('error', (err) => {
  logger.error(`An error occured while interfacing with mongodb: ${err}`);
});

// wait until the connection is ready
mongoose.connection.once('open', () => { 
  // fire a ready event 
  status.emit('ready'); 
});

// export configurations
module.exports = {
  logger: logger,
  app: app,
  port: port,
  status: status
}