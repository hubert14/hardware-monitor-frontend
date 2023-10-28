const steamApi = require("./api/steamApiService")
const { settings } = require("../../settings-profiler");

cachedProfiles = [];
cachedGameLib = [];

function getProfiles(callback) {
    steamApi.getProfile(settings.steam.steamIds).then(result => {
        // always show the latest one because when reload page it doesn't shown (because is not updated since last check)
        // if (!isChanged(result)) return;
        cachedProfiles = result;
        callback(result);
    },
    err => {
        console.log(err);
    });
}

function isChanged(profiles) {
    for (let profile of profiles) {
        const existedInCache = cachedProfiles.filter(cp => cp.steamId == profile.steamId);
        if (!existedInCache || !existedInCache.length || !profile.equals(existedInCache[0])) return true;
    }
    return false;
}

module.exports = { getProfiles };