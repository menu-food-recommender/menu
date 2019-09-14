const dbConnection = require("./DBConnect.js");
const fs = require('fs');

var total = 0;
var foodTypesMap = {};
dbConnection.ref.child('menu_items').once('value').then(snap => {
  snap.forEach(snapChild => {
    let child = snapChild.val();
    if(foodTypesMap[child.foodTypes]) foodTypesMap[child.foodTypes] = 0;
    else foodTypesMap[child.foodTypes]++;
    total++;
  })
}).then(()=>{
  var logger = fs.createWriteStream('foodTypes.txt', {
    flags: 'a' // 'a' means appending (old data will be preserved)
  });
  for (let [k, v] of Object.entries(foodTypesMap)){
    console.log(k + ": " +  (v / total) * 100);
    logger.write(k + "\n");
  };
  console.log("\n" + "There are " + Object.keys(foodTypesMap).length + " food types");
});
