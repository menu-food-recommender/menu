//setup firebase admin
var admin = require("firebase-admin");
const request = require('request-promise');
var serviceAccount = require("./creds/menu-9d9a8-firebase-adminsdk-cozx3-ebac905e09.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://menu-9d9a8.firebaseio.com"
});


// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var ref = db.ref("restricted_access/secret_document");
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});


// Get a database reference to our blog
var db = admin.database();
var ref = db.ref();


//set up routing to save menu items
var menuitemsRef = ref.child("menu_items");


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
        item["labels"] = rest.foodTypes;
        restItems.push(item);
        menuitemsRef.push(item);
      });
      resolve(restItems);
    });
  }))).then((menuItems)=>{
    console.log(menuItems);
  });
});
