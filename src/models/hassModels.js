class SensorData {
    constructor(data) {
        this.entity_id = data.entity_id;
        this.state = data.state;
        this.attributes = data.attributes;
        this.last_changed = data.lastChanged;
        this.last_updated = data.lastUpdated;
        this.context = data.context;
    }
}

module.exports = { SensorData };