// commission report

let mongoose = require('mongoose');

// define the CommissionReport for mongoose
let CommissionReport = mongoose.model('commissionReport', mongoose.Schema({
    policyFaceAmount: Number,
    hierarchy: String,
    commissionPlan: String,
    superAgentCommissions: [Number],
    sellingAgentCommission: Number,
    totalCommission: Number,
    time: { type : Date, default: Date.now }
}, { bufferCommands: false }));

// export the CommissionReport as the module
module.exports = CommissionReport;