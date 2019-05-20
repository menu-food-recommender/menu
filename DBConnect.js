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
//var menuitemsRef = ref.child("menu_items");

export ref;
