import { Meteor } from "meteor/meteor";
import { Products } from "/imports/api/collections/products";

Products.collection.addLinks({
  user: {
    collection: Meteor.users,
    field: "userId",
    type: "one",
  },
});
