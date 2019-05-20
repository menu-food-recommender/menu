import ref from "./DBConnect"

let restaurantLabels = {};
//accumulate the cuisines, food types and ingredients for each restaurant
let arr = [["cuisines", restaurantsCuisine], ["foodTypes", restuarantsFoodTypes], ["ingredients", restaurantsIngredients]];
arr.map((prop) =>{
  if (restaurantLabels[child.restaurant]) {
      let current = Object.values(child.prop);
      let existing = restaurantLabels[child.restaurant];
      restaurantLabels[child.restaurant] = current.concat(existing);
  } else {
      restaurantLabels[child.restaurant] = [];
      restaurantLabels[child.restaurant] = child.prop;
  }
});

//save the restaurant to cuisine, foodType and ingredient associations
let restaurantsRef = ref.child("restaurants");
restaurantsRef.push(restaurantLabels);
