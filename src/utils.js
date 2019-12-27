import fetch from 'node-fetch';
import moment from 'moment';

import API_KEY from '../api-key';

//"https://clifftam.com/much-data-youtube-video-use/"
//"https://www.whistleout.com/CellPhones/Guides/How-Much-Data-Does-YouTube-Use"

const defaultCarbonIntensityFactorIngCO2PerKWh = 519;
const DATA_CENTER_IMPACT = 0.0000000000720;
const NETWORK_WIFI_IMPACT = 0.000000000152;
const NETWORK_MOBILE_IMPACT = 0.000000000884;
const SMARTPHONE_IMPACT = 0.00011;
const LAPTOP_IMPACT = 0.00032;

const bytesByMinute1080p = 50000;
const bytesByMinute720p = 25000;
const bytesByMinute480p = 8300;

const listVideoIds = (channelId) => 
fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&key=${API_KEY}&channelId=${channelId}&maxResults=50&type=video&order=viewCount&publishedAfter=2019-01-01T00:00:00Z`)
.then(response => response.json())
.then(data => data.items)
.then(items => items.map(item => item.id))
.then(ids => ids.map(id => id.videoId));

const videoInfos = (id) => 
fetch(`https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&part=contentDetails,statistics&id=${id}`)
.then(response => response.json())
.then(data => data.items[0])
.then(({contentDetails, statistics}) => (
    {id: id, duration: contentDetails.duration, definition: contentDetails.definition, viewCount: statistics.viewCount}));

const videoHDWeight = (duration) => duration * (bytesByMinute480p + bytesByMinute1080p) / 2;
const videoImpactInkWh = (weight, duration) => 
  DATA_CENTER_IMPACT * weight + (NETWORK_MOBILE_IMPACT + NETWORK_WIFI_IMPACT) / 2 * weight + (SMARTPHONE_IMPACT + LAPTOP_IMPACT) / 2 * duration;
const videoImpactIngCO2e = (weight, duration) => videoImpactInkWh(weight,duration) * defaultCarbonIntensityFactorIngCO2PerKWh;

export const formatImpactToMegaTonne = (impact) => `${Math.round(impact / 1000000)} Tonnes CO2eq`

export default (channelId) => 
listVideoIds(channelId).then(videoIds => Promise.all(videoIds.map(videoId => videoInfos(videoId))))
.then(videos => videos.map(({duration, viewCount}) => {
    let momentDuration = moment.duration(duration);
    let minutes = momentDuration.minutes();
    return(Math.round(viewCount * videoImpactIngCO2e(videoHDWeight(minutes), minutes)))}))
.then(videoImpacts => videoImpacts.reduce((acc, value) => acc + value));
