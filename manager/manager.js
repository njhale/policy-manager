// manager.js

// require logging
let logger = require('../config').logger;

// require models
let models = require('./models');
let Agent = models.Agent;
let CommissionPlan = models.CommissionPlan;
let CommissionReport = models.CommissionReport;
let Hierarchy = models.Hierarchy;


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

function findHierarchy(name) {

    let promise;

    try {
        // perform a findOne
        logger.info(`Finding hierarchy ${name}...`);
        let query = CommissionPlan.findOne({ name: name });
        promise = query.exec(); // get the promise       
        logger.info(`Hierarchy ${name} found`); 

      } catch (err) {
        logger.error(`An error has occurred while getting a hierarchy: ${err}`);

      }

      return promise;
      
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

function getCommissionReport(policyFaceAmount, hierarchyName, commissionNamePlan) {

    // get promises for hierarchies and commission plans
    let hierarchyPromise = findHierarchy(hierarchyName);
    let planPromise = findCommissionPlan(commissionNamePlan);

    hierarchyPromise.then((hierarchy) => {
        planPromise.then((plan) => {

            // check for existance
            if (!hierarchy) {
                throw `Hierarchy ${hierarchyName} does not exist!`;
            }

            if (!plan) {
                throw  `Plan ${commissionNamePlan} does not exist!`;
            }

            // get the selling agent promise
            let sellingAgentPromise = findAgent(hierarchy.sellingAgent);

            sellingAgentPromise.then((sellingAgent) => {

                // check for existance
                if (!sellingAgent) {
                    throw `Selling agent ${hierarchy.sellingAgent} does not exist!`;
                }

                let 
            })

            

            // create and instantiate a new commission report 
            let report = new CommissionReport();
            report.policyFaceAmount = policyFaceAmount;
            report.hierarchy = hierarchyName;
            report.CommissionPlan = commissionNamePlan;
            report.sellingAgentCommission = 
            // iterate through all super agents, 
            for (int i = 0; i < hierarchy.superAgents.length; i++) {

            }
        });

    });



}