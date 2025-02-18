import { Meteor } from "meteor/meteor";
import { Products } from "/imports/api/collections/products";
import { Categories } from "/imports/api/collections/categories";

 Products.collection.addLinks({
   user: {
     collection: Meteor.users,
     field: "userId",
     type: "one",
   },
   categories: {
     collection: Categories.collection,
     field: "categoryIds",
     type: "many"
   },
 });

Categories.collection.addLinks({
  user: {
    collection: Meteor.users,
    field: "userId",
    type: "one",
  },
  products: {
    collection: Products.collection,
    autoremove: true,
    // inversedBy: "categories",
  }
});