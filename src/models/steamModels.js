class SteamProfile {
    constructor(profile) {
        this.steamId = profile.steamid;
        this.nick = profile.personaname;
        this.status = profile.personastate;
        this.avatar = profile.avatar;
        this.lastlogoff = profile.lastlogoff;
        this.gameTitle = profile.gameextrainfo;
        this.statusTitle = this.statusPostfix();
    }

    isUnknown = () => this.status == -1;
    isOnline = () => this.status != 0;
    isInGame = () => !!this.gameTitle;

    statusPostfix = () => {
        if (this.isUnknown()) return 'unknown';
        if (this.isInGame()) return 'playing';
        if (this.isOnline()) return 'online';
        return 'offline';
    }

    equals = (profile) =>
        profile.steamId == this.steamId &&
        profile.nick == this.nick &&
        profile.avatar == this.avatar &&
        profile.status == this.status &&
        profile.lastlogoff == this.lastlogoff &&
        profile.gameTitle == this.gameTitle;
}

class SteamGame {
    constructor(appData) {
        this.appId = appData.steam_appId;
        this.title = appData.name;
        this.image = appData.header_image;
    }
}

module.exports = { SteamProfile, SteamGame };