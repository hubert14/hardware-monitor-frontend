module.exports = {
    settings: {
        window: {
            display_size_x: 480,
            display_size_y: 800,
            width: 495,
            height: 510,
            x: -1,
            y: 330
        },
        steam: {
            apiKey: '',
            mainSteamId: '',
            steamIds: [
                '',
                '',
                '',
                ''
            ],
            libraryFileName: 'apps-library.json'
        },
        hardware: {
            connection: {
                server: 'localhost',
                port: 49001
            }
        },
        hass: {
            apiKey: '',
            baseUrl: 'http://srv/api',
            sensors: {
                co2: 'sensor.bme680_co2_equivalent',
                alert: ''
            }
        }
    }
}