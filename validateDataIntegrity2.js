const dbConnection = require("./DBConnect.js");
const fs = require('fs');


//delete any field that isn't the right data type or doesn't have the right fields
function validateDataIntegrity(){
  var itemsDeleted = 0;
  dbConnection.ref.child('menu_items').once('value').then(snap => {
    snap.forEach(snapChild =>{
      let item = snapChild.val();
      if(typeof item !== "object" ||
        !item["ingredients"] ||
        !item["foodTypes"]){
          dbConnection.ref.child("menu_items/" + snapChild.key).remove();
          itemsDeleted++;
        }
    })
  }).then(()=>{
    console.log(itemsDeleted);
    // process.exit();
  });
}

validateDataIntegrity();
