const dbConnection = require("./DBConnect.js");
const fs = require('fs');


//delete any field that isn't the right data type or doesn't have the right fields
function validateDataIntegrity(){
  var itemsDeleted = 0;
  var promises = [];
  dbConnection.ref.child('menu_items').once('value').then(snap => {
    snap.forEach(snapChild =>{
      let item = snapChild.val();
      if(typeof item !== "object" ||
        !item["restaurant"] ||
        !item["foodTypes"] ||
        !item["cuisines"] ||
        !item["description"] ||
        !item["ingredients"]){
          itemsDeleted++;
          dbConnection.ref.child("menu_items/" + snapChild.key).remove();
      }
    })
  })
}

validateDataIntegrity();
