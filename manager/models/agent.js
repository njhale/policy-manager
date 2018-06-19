// agent.js

let mongoose = require('mongoose');

// define the Agent for mongoose
let Agent = mongoose.model('agent', mongoose.Schema({
    name: { type: String, index: true },
    commissionPercentage: Number, 
    superAgent: Boolean,
    time: { type : Date, default: Date.now }
}, { bufferCommands: false }));

// export the Agent as the module
module.exports = Agent;