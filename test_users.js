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
  console.log("snapshot: " + snapshot.val());
});

// Get a database reference to our blog
var db = admin.database();
var ref = db.ref();

var usersRef = ref.child("users");
var meunuitemsRef = ref.child("menu_items");
var cuisinesRef = ref.child("cuisines")

function addUser(name, preferences){
  let user = {};
  user["name"] = name;
  user["preferences"] = preferences;
  usersRef.push(user);
}

addUser("Ohmar", ['Indian cuisine']);
addUser("Sarah", ['Indian cuisine', 'Mexican cuisine']);
addUser("Bob", ['']);
