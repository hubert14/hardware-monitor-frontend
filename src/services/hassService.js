const apiService = require('./api/hassApiService');
const { settings } = require('../../settings-profiler');

async function getCo2SensorData() {
    const response = await apiService.getSensorData(settings.hass.sensorId);
    return response;
}

module.exports = { getCo2SensorData };