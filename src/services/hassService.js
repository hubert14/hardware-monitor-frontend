const apiService = require('./api/hassApiService');
const { settings } = require('../../settings-profiler');

async function getSensorsAsync() {
    const co2 = await apiService.getSensorData(settings.hass.sensors.co2);
    const alert = await apiService.getSensorData(settings.hass.sensors.alert);
    return { co2: co2, alert: alert };
} 

module.exports = { getSensorsAsync };