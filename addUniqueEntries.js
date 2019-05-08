//setup firebase admin
var admin = require("firebase-admin");
var serviceAccount = require("./creds/menu-9d9a8-firebase-adminsdk-cozx3-ebac905e09.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://menu-9d9a8.firebaseio.com"
});

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
var searchRef = ref.child("search_tree");
// var cuisinesRef = ref.child("cuisines");
// var foodTypesRef = ref.child("foodTypes");
// var ingredientsRef = ref.child("ingredients");

// function addUniqueEntries(accumulatorRef, prop){
//   meunuitemsRef.once('value').then(menuitem =>{
//     accumulatorRef.once('value').then(snapshot =>{
//       items = snapshot.val();
//       if(!items.contains(menuitem[prop])) menuitemsRef.push(menuitem[prop]);
//       if(!items.some(i => menuitem[prop]))
//     })
//   })
// }

function addUniqueEntries(propHierarchy){
  return new Promise((resolve, reject) => {
    var menu_item;
    menuitemsRef.once('value').then(function(snapshot){
      let searchTree = {};
      Object.values(snapshot.val()).map(menuitem =>{
        // console.log(menu_item);
        menu_item = menuitem;
        createHierarchyObjs(searchTree, menu_item);
      });
      resolve(searchTree);
    });

    function createHierarchyObjs(searchTree, menu_item){
      recurse(searchTree, searchTree, 0);
    }

    function recurse(local, localPrev, i){
      if(i >= propHierarchy.length || menu_item[propHierarchy[i]] == null) {
        local = localPrev;                  //set the local scope to one up
        return;                            //base case
      }
      menu_item[propHierarchy[i]].map(tag =>{         //recursive case
        let menuProp = tag;
        if(!local.hasOwnProperty(menuProp)) local[menuProp] = {};
        else local[menuProp];
        recurse(local[menuProp], local, i + 1);
      })
      local = localPrev;
    }
  });
}

addUniqueEntries(["cuisines", "foodTypes", "ingredients"]).then(searchTree =>{
  console.log("the search tree: " + JSON.stringify(searchTree, null, 2));
  searchRef.set(searchTree);
});
// addUniqueEntries(cuisinesRef, "cuisines");
// addUniqueEntries(foodTypesRef, "foodTypes");
// addUniqueEntries(ingredientsRef, "ingredients");

export default addUniqueEntries;
