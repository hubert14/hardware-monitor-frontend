const axios = require('axios');
const { SteamProfile, SteamGame } = require("../../models/steamModels");
const { settings } = require('../../../settings')

module.exports = {
    getProfile,
    getFriendsList,
    getAppById
};

async function getProfile(steamids) {
    const response = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${settings.steam.apiKey}&steamids=${steamids}`);
    return response.data.response.players.map(p => new SteamProfile(p));
}

async function getFriendsList(steamid) {
    const response = await axios.get(`https://https://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${settings.steam.apiKey}&steamid=${steamid}&relationship=friend`);
    return response.data.friendslist.friends.map(f => new SteamProfile(f));
}

async function getAppById(appId) {
    const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}`)
    return new SteamGame(response.data[`${appId}`].data);
}