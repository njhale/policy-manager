// hierarchy.js

let mongoose = require('mongoose');

// define the Hierarchy for mongoose
let Hierarchy = mongoose.model('hierarchy', mongoose.Schema({
    name: { type: String, index: true },
    superAgents: [String],
    sellingAgent: String,
    time: { type : Date, default: Date.now }
}, { bufferCommands: false }));

// export the Hierarchy as the module
module.exports = Hierarchy;