// server.js
'use strict';

let config = require('./config');
let Agent = require('./lib/models/agent');
let Hierarchy = require('./lib/models/hierarchy');
let manager = require('./lib/manager');
let logger = config.logger;

logger.info("Hello World!");

// var agent = new Agent();

// agent.save((err) => {
//     console.log(`saved: ${err}`);
// });

config.status.on('ready', () => {
    logger.info("I'm ready...");
});

let h = new Hierarchy();
h.name = "mow"

function save() {
    h.save((err) => {
        logger.info(`mow: ${h} : ${err}`);
    })
}

function read() {
    Hierarchy.findOne({ name: h.name }).exec().then((hierarchy) => {
        logger.info(`I have the hierarchy! ${JSON.stringify(hierarchy)}`);
    });
}

setInterval(save, 1000);
setInterval(read, 500);


