import { Meteor } from "meteor/meteor";
import { Products } from "/imports/api/collections/products";
import { Categories } from "/imports/api/collections/categories";


Categories.collection.addLinks({
  user: {
    collection: Meteor.users,
    field: "userId",
    type: "one",
  },
  products: {
    collection: Products.collection,
    inversedBy: "categories"
  }
});

Products.collection.addLinks({
   user: {
     collection: Meteor.users,
     field: "userId",
     type: "one",
   },
   categories: {
     collection: Categories.collection,
     field: "categoryIds",
     type: "many",
     autoremove: true
   },
 });

