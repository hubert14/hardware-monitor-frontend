const axios = require('axios');
const { SensorData } = require('../../models/hassModels');
const { settings } = require('../../../settings-profiler');

const config = { headers: { Authorization: `Bearer ${settings.hass.apiKey}` } };

async function getSensorData(sensorId) {
    try {
        const response = await axios.get(`${settings.hass.baseUrl}/states/${sensorId}`, config);
        return new SensorData(response.data);
    }
    catch(e) {
        console.error(e.cause);
    }
    
}

module.exports = { getSensorData };