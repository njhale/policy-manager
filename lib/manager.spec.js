// manager.spec.ts
'use strict';

let expect = require('chai').expect;
let config = require('../config');
let manager = require('./manager');

let logger = config.logger;

let Agent = require('./models/agent');

let agent = new Agent({
    name: 'Bob',
    commissionPercentage: 2.0,
    superAgent: false
});

describe('createAgent()', () => {

    before((done) => {
        // config.mockgoose.helper.reset().then(() => {
        //     logger.info('resetting mockgoose');
        //     // done()
        // });
        logger.info(`Hello!`);
        config.status.on('ready', () => {
            logger.info("I'm ready...");
            done();
        });

    });
    
    
    it('Should store an Agent in mongodb', () => {
        // expect(manager.createAgent, agent).to.not.throw()
        agent.save((err) => {
            logger.error(`Error when saving: ${err}`)
            agent.save((err) => logger.error(`Error when saving: ${err}`));
            manager.findAgent('Bob').then((a) => logger.info(`Meep-Morps ${JSON.stringify(a)}`));
        });
        
    });

    it('Should fail to create the same agent', () => {
        // expect(manager.createAgent, agent).to.throw()
    });
    
});

