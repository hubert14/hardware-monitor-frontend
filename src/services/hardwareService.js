const hardwareGrpcService = require('./api/hardware/hardwareGrpcService');

function updateHardwareInfo(callback) {
    hardwareGrpcService.collectHardwareInfo(callback);
}

module.exports = { updateHardwareInfo };