const dbConnection = require("./DBConnect.js");

let restaurants = {};
let props = ['cuisines', 'foodTypes', 'ingredients'];
dbConnection.ref.child('menu_items').once('value').then((snap) => {
  snap.forEach((snapChild) =>{
    let child = snapChild.val();
    props.map((prop) =>{
      if (!restaurants[child.restaurant]) {
          restaurants[child.restaurant] = {};
          restaurants[child.restaurant][prop] = {};
          restaurants[child.restaurant][prop] = child[prop];
      }
      else {
        let current = new Set(Object.values(child[prop] || {}));
        let existing = new Set(Object.values(restaurants[child.restaurant][prop] || {}));
        restaurants[child.restaurant][prop] = [...new Set([...current, ...existing])];
      }
      if(!restaurants[child.restaurant]["menu-items"]){
        restaurants[child.restaurant]["menu-items"] = [];
      }
    });
    restaurants[child.restaurant]["menu-items"].push(snapChild.key);
  });
}).then(() =>{
  //save the restaurant to cuisine, foodType and ingredient associations
  console.log("restaurants: " + JSON.stringify(restaurants, null, 4));
  let restaurantsRef = dbConnection.ref.child("restaurants");
  restaurantsRef.set(restaurants);
});
