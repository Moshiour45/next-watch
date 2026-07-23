const https = require('https');
const movies = [
  {id: 'tt1375666', name: 'Inception'},
  {id: 'tt0816692', name: 'Interstellar'},
  {id: 'tt5027774', name: 'Dunkirk'},
  {id: 'tt6751668', name: 'Parasite'},
  {id: 'tt1856101', name: 'Blade Runner 2049'},
  {id: 'tt6723592', name: 'Tenet'}
];
movies.forEach(m => {
  https.get('https://www.imdb.com/title/' + m.id + '/', {
    headers: {'User-Agent': 'Mozilla/5.0'}
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const match = data.match(/<meta property="og:image" content="(.*?)"/);
      if (match) console.log(m.name + ': ' + match[1]);
    });
  });
});
