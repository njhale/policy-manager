// manager.js
'use strict';

// require logging
let logger = require('../config').logger;

// require models
let Agent = require('./models/agent');
let CommissionPlan = require('./models/commission-plan');
let CommissionReport = require('./models/commission-report');
let Hierarchy = require('./models/hierarchy');

// export named functions
module.exports = {
    createCommissionPlan: createCommissionPlan,
    findCommissionPlan: findCommissionPlan,
    createHierarchy: createHierarchy,
    findHierarchy: findHierarchy,
    createAgent: createAgent,
    findAgent: findAgent,
    findAgents: findAgents,
    getCommissionReport: getCommissionReport
}

function createCommissionPlan(plan) {
    
    try {
        // attempt to save the plan
        plan.save();
    } catch (err) {

        logger.error(`An error occurred while attempting to create commission plan ${plan.name}: ${err}`);
        throw err

    }

}

function findCommissionPlan(name) {

    let promise;

    try {
        // perform a findOne
        logger.info(`Finding commission plan ${name}...`);
        let query = CommissionPlan.findOne({ name: name });
        promise = query.exec(); // get the promise       
        logger.info(`Commission plan ${name} found`); 

      } catch (err) {
        logger.error(`An error has occurred while getting a commission plan: ${err}`);
      }

      return promise;
}

function createHierarchy(hierarchy) {
    
    try {
        // attempt to save the hierarchy
        hierarchy.save();
    } catch (err) {

        logger.error(`An error occurred while attempting to create hierarchy ${hierarchy.name}: ${err}`);
        throw err

    }

}

function findHierarchy(name) {

    let promise;

    try {
        // perform a findOne
        logger.info(`Finding hierarchy ${name}...`);
        let query = Hierarchy.findOne({ name: name });
        promise = query.exec(); // get the promise       
        logger.info(`Hierarchy ${name} found`); 

      } catch (err) {
        logger.error(`An error has occurred while getting a hierarchy: ${err}`);

      }

      return promise;
      
}

function createAgent(agent) {
    
    try {
        // attempt to save the agent
        agent.save((err) => {
            if (err) {
                logger.error(`An error occurred while attempting to save agent ${agent.name}: ${err}`);
            }
        });

    } catch (err) {

        logger.error(`An error occurred while attempting to create agent ${agent.name}: ${err}`);
        throw err

    }

}

function findAgent(name) {

    let promise;

    try {
        // perform a findOne
        logger.info(`Finding agent ${name}...`);
        let query = Agent.findOne({ name: name });
        promise = query.exec(); // get the promise       
        logger.info(`Agent ${name} found`); 

      } catch (err) {
        logger.error(`An error has occurred while getting an agent: ${err}`);

      }

      return promise;
      
}

function findAgents(names) {

    let promises = [];

    try {

        for (let name of names) {
            promises.push(findAgent(name));
        }
        

      } catch (err) {
        logger.error(`An error has occurred while getting agents: ${err}`);

      }

      return promises;

}

// getCommissionReport
function getCommissionReport(policyFaceAmount, hierarchyName, commissionNamePlan) {

    let promise = new Promise((resolve, reject) => {
        // get promises for hierarchies and commission plans
        let hierarchyPromise = findHierarchy(hierarchyName);
        let planPromise = findCommissionPlan(commissionNamePlan);

        hierarchyPromise.then((hierarchy) => {
            planPromise.then((plan) => {

                // check for existence
                if (!hierarchy) {
                    reject(`Hierarchy ${hierarchyName} does not exist!`);
                }

                if (!plan) {
                    reject(`Plan ${commissionNamePlan} does not exist!`);
                }

                // get the selling agent promise
                let sellingAgentPromise = findAgent(hierarchy.sellingAgent);

                sellingAgentPromise.then((sellingAgent) => {

                    // check for existence
                    if (!sellingAgent) {
                        reject(`Selling agent ${hierarchy.sellingAgent} does not exist!`);
                    }

                    // create and instantiate a new commission report 
                    let report = new CommissionReport();
                    report.policyFaceAmount = policyFaceAmount;
                    report.hierarchy = hierarchyName;
                    report.CommissionPlan = commissionNamePlan;
                    report.sellingAgentCommission = 
                        sellingAgent.commissionPercentage * plan.sellingAgentPercentage * policyFaceAmount;
                    report.superAgentCommissions = new Array(hierarchy.superAgents.length).fill(0);
                    report.totalCommission = sellingAgentCommission;

                    // get super agent promises
                    let superAgentPromises = findAgents(hierarchy.superAgents);
                    let resolvedSuperAgents = 0;

                    // iterate through promises, calculating commissions
                    for (let i = 0; i < superAgentPromises.length; i++) {
                        let p = superAgentPromises[i];
                        p.then((superAgent) => {
                            // check for existence
                            if (!superAgent) {
                                reject(`Super agent ${hierarchy.superAgents[i]} does not exist!`);
                            }
                            
                            // calculate commission
                            superAgentCommissions[i] = 
                                superAgent.commissionPercentage * plan.superAgentPercentages[i] * policyFaceAmount;

                            report.totalCommission += superAgentCommissions[i];

                            // Questionably threadsafe
                            if (i == superAgentPromises.length - 1) {
                                // store the report
                                try {
                                    report.save();
                                } catch(err) {
                                    logger.error(`An error occurred while attempting to save a commission report: ${err}`);
                                }

                                // resolve the promise
                                resolve(report);

                            }

                        }); // p.then
                    }
                }); // sellingAgentPromise.then

            });  // planPromise.then

        });  // hierarchyPromise.then
    
    });  // new Promise

    return promise;
    
}