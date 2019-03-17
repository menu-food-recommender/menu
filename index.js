const request = require('request');

// Get restaurant API keys
request.get({
  headers: {
    'X-Access-Token': '__API_EXPLORER_AUTH_KEY__'
  },
  method: 'GET',
  uri: 'https://eatstreet.com/publicapi/v1/restaurant/search?method=both&street-address=800+W+Campbell+Rd,+Richardson,+TX+75080',
}, (err, res, body) => {
  if (err) return console.log(err);
  JSON.parse(body).restaurants.map(rest => {
    console.log("apiKey: " + rest.apiKey + "\n");
  });
});

// Seach for menus of each restaurant API key
