//setup firebase admin
var admin = require("firebase-admin");
const request = require('request-promise');
var serviceAccount = require("./creds/menu-9d9a8-firebase-adminsdk-cozx3-ebac905e09.json");

const util = require('util');
const exec = util.promisify(require('child_process').exec);

const fs = require('fs');


async function parseDesc(desc){
  const { stdout, stderr } = await exec('python ./parse_description.py ' +  '\"' + desc + '\"');
  console.log('stdout: ', stdout);
  console.log('stderr: ', stderr);
  return stdout.split('\n')[0];
}

//find the cuisines in a foodTypes description
//extract all adjectives from the foodTypes
//or, ignore everything that is an actual food
function findCuisinesPromise(rest){
  //determine if the food type is an actual food type --> if so, eliminate it.
  //Done with google search
  //return rest.foodTypes.filter(val => menuCategories.includes(val));
  //next, look up in wikipedia's API to see if a foodType is a cuisine
  let wikiRequests = [];
  rest.foodTypes.map(foodType => {
    let cuisine = foodType.includes("cuisine") ? foodType : foodType + " Cuisine";
    wikiRequests.push(new Promise((resolve, reject) => {
      request.get({
        method: 'GET',
        uri: 'https://en.wikipedia.org/w/api.php?action=query&format=json&list=prefixsearch&pssearch=' + cuisine,
        format: "json"
      }, (err, res, body) =>{
        if(err) reject(err);
        body = JSON.parse(body);
        if(body.query.prefixsearch.length > 0) resolve(body.query.prefixsearch[0].title);
      });
    }));
  });
  return Promise.all(wikiRequests);
}


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://menu-9d9a8.firebaseio.com"
});


// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var ref = db.ref("restricted_access/secret_document");
ref.once("value", function(snapshot) {
  console.log("snapshot: " + snapshot.val());
});


// Get a database reference to our blog
var db = admin.database();
var ref = db.ref();


//set up routing to save menu items
var menuitemsRef = ref.child("menu_items");
var cuisinesRef = ref.child("cuisines");
var foodTypesRef = ref.child("foodTypes");
var ingredientsRef = ref.child("ingredients");

//remove menuitems from database
menuitemsRef.remove();

// Get restaurant API keys
let aPromise = new Promise((resolve, reject) => {
  request.get({
    headers: {
      'X-Access-Token': '__API_EXPLORER_AUTH_KEY__'
    },
    method: 'GET',
    uri: 'https://eatstreet.com/publicapi/v1/restaurant/search?method=both&pickup-radius=80&street-address=800+W+Campbell+Rd,+Richardson,+TX+75080',
  }, (err, res, body) => {
    if (err) reject(err);
    resolve(JSON.parse(body).restaurants);
    // restaurantsRef.push();
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
      let itemPromises = [];
      itemPromises.push(findCuisinesPromise(rest));
      JSON.parse(body).map(menuCategory =>{
        menuCategory.items.map(item => {
          if(item["description"] != null){
            itemPromises.push(new Promise((resolve, reject) =>{
              resolve([]);                                            //instantiate an empty response. The python script is responsible for populating this
            }));
            Promise.all(itemPromises).then(([cuisines, ingredients]) => {           //when the cuisines and ingredient promises are resolved
              item["restaurant"] = rest.name;
              item["foodTypes"] = [menuCategory.name];
              item["cuisines"] = cuisines;
              item["ingredients"] = ingredients;
              menuitemsRef.push(item);
            });
          }
        });
        resolve(restItems);
      });
    });
  }))).then((menuItems)=>{                        //when all tasks are done
    console.log("Done aggregating menu items");
  });
});
