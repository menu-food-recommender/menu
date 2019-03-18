const request = require('request-promise');

// Get restaurant API keys
let aPromise = new Promise((resolve, reject) => {
  request.get({
    headers: {
      'X-Access-Token': '__API_EXPLORER_AUTH_KEY__'
    },
    method: 'GET',
    uri: 'https://eatstreet.com/publicapi/v1/restaurant/search?method=both&street-address=800+W+Campbell+Rd,+Richardson,+TX+75080',
  }, (err, res, body) => {
    if (err) reject(err);
    resolve(JSON.parse(body).restaurants);
  })
});

// Get the menu items from each restaurant 
aPromise.then(restaurants =>{
  Promise.all(restaurants.map(rest => new Promise((resolve, reject) =>{
    console.log("apiKey: " + rest.apiKey + "\n");
    request.get({
      headers: {
        'X-Access-Token': '__API_EXPLORER_AUTH_KEY__'
      },
      method: 'GET',
      uri: 'https://eatstreet.com/publicapi/v1/restaurant/' + rest.apiKey + '/menu?includeCustomizations=false',
    }, (err, res, body) => {
      if (err) reject(err);
      let restItems = [];
      JSON.parse(body)[0].items.map(item => {
        restItems.push(item);
      });
      resolve(restItems);
    });
  }))).then((menuItems)=>{console.log(menuItems)});
});
