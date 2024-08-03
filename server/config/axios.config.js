const axios = require('axios');
const querystring = require('querystring');
const apiCongif = require('./api.config');


const musixmatch = axios.create({ baseURL: apiCongif.MUSIXMATCH_BASE_URL });

const musixmatchApi = async (endpoint, parameters) => {
    try{
        const apiUrl = `${endpoint}${querystring.stringify(parameters)}&apikey=${apiCongif.MUSIXMATCH_API_KEY}`;
        const response = await musixmatch.get(apiUrl);
        return response.data;
    }
    catch(err){
        console.log(err);
    }
}

module.exports = musixmatchApi;