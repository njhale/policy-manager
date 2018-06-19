// server.js

let config = require('./config');
let Agent = require('./lib/models').Agent;
let Hierarchy = require('./lib/models').Hierarchy;
let logger = config.logger;

logger.info("Hello World!");

// var agent = new Agent();

// agent.save((err) => {
//     console.log(`saved: ${err}`);
// });

let h = new Hierarchy();
h.name = "mow"

function save() {
    h.save((err) => {
        logger.info(`mow: ${h} : ${err}`);
    })
}

setInterval(save, 1000);



