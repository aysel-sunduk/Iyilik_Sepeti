const https = require('https');

function fetchVideos(query) {
  https.get('https://www.youtube.com/results?search_query=' + encodeURIComponent(query), { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => {
      const regex = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
      let match;
      const ids = new Set();
      while ((match = regex.exec(data)) !== null) {
        ids.add(match[1]);
      }
      console.log(query, Array.from(ids).slice(0, 3));
    });
  });
}

fetchVideos('yardimlasma kampanyasi');
fetchVideos('sokak kopekleri besleme');
