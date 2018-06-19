// manager.spec.ts

let expect = require('chai').expect;
let config = require('../config');
let manager = require('./manager');
let models = require('./models');

let Agent = models.Agent;

describe('createAgent()', () => {

    before((done) => {
        config.status.on('ready', () => {
            done();
        });
    });
    
    let agent = new Agent({
        name: 'Bob',
        commissionPercentage: 2.0,
        superAgent: false
    });

    it('Should store an Agent in mongodb', () => {
        expect(manager.createAgent, agent).to.not.throw()
    });

    it('Should fail to create the same agent', () => {
        expect(manager.createAgent, agent).to.throw()
    });
    
});

