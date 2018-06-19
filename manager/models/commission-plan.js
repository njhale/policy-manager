// commission-plan.js

let mongoose = require('mongoose');

// define the CommissionPlan for mongoose
let CommissionPlan = mongoose.model('commissionPlan', mongoose.Schema({
    name: { type: String, index: true },
    superAgentPercentages: [Number],
    sellingAgentPercentage: Number,
    time: { type : Date, default: Date.now }
}, { bufferCommands: false }));

// export the CommissionPlan as the module
module.exports = CommissionPlan;
