const fs = require('fs');
const steamApi = require("./api/steamApiService")
const { settings } = require("../../settings-profiler");

cachedProfiles = [];
cachedGameLib = [];

module.exports = {
    getMainUserProfile,
    getProfiles,
    getGame
};

async function getMainUserProfile() {
    try {
        const result = await steamApi.getProfile(settings.steam.mainSteamId);
        return result;
    } catch (e) {
        console.error("Error fetching your Steam profile:" + e);
    }
}

async function getProfiles() {
    const result = await steamApi.getProfile(settings.steam.steamIds);
    if (!isChanged(result)) return { changed: false, profiles: cachedProfiles };

    result.forEach(async profile => {
        if (profile.isInGame()) {
            const game = await getGame(profile.gameId);
            profile.gameTitle = game.title;
        }
    });

    cachedProfiles = result;
    return {changed: true, profiles: result };
}

async function getGame(appId) {
    if (cachedGameLib.length == 0) {
        cachedGameLib = JSON.parse(fs.readFileSync(settings.steam.libraryFileName, 'utf-8'));
    }

    const existedInCache = cachedGameLib.filter(cg => cg.appId == appId);
    if (existedInCache && existedInCache.length) return existedInCache[0];

    const response = await steamApi.getAppById(appId);
    cachedGameLib += response;
    fs.writeFileSync(settings.steam.libraryFileName, JSON.stringify(cachedGameLib), { flag: 'w' });
}

function isChanged(profiles) {
    for (let profile of profiles) {
        const existedInCache = cachedProfiles.filter(cp => cp.steamId == profile.steamId);
        if (!existedInCache || !existedInCache.length || !profile.equals(existedInCache[0])) return true;
    }
    return false;
}